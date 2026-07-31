/* Halcyon → Google Calendar (read-only).
   Runs entirely in the browser. Client ID only — there is no client secret here
   and there must never be one, because anyone can read this file. */
(function () {
  var CLIENT_ID = '43875064326-0s81o6vukjiu3llk66p24156e7l2dood.apps.googleusercontent.com';
  var SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
  var KEY = 'halcyon-gcal-token';
  var LINKED = 'halcyon-gcal-linked';

  var client = null;
  var pending = null;

  /* ---- token storage ----
     Access tokens last about an hour and cannot be refreshed from a browser.
     Kept in sessionStorage so they die with the tab; a silent re-request
     renews them without any popup once you've granted access once. */
  function readToken() {
    try {
      var t = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (!t || !t.token || t.expires < Date.now() + 30000) return null;
      return t.token;
    } catch (x) { return null; }
  }
  function writeToken(token, expiresIn) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({
        token: token,
        expires: Date.now() + (Number(expiresIn) || 3600) * 1000
      }));
      localStorage.setItem(LINKED, '1');
    } catch (x) {}
  }
  function clearToken() {
    try { sessionStorage.removeItem(KEY); localStorage.removeItem(LINKED); } catch (x) {}
  }

  /* ---- plain-English errors ---- */
  function explain(code) {
    switch (String(code || '')) {
      case 'popup_closed':
        return 'The Google window was closed before sign-in finished.';
      case 'popup_failed_to_open':
        return 'Your browser blocked the Google popup. Allow popups for this site and try again.';
      case 'access_denied':
        return 'Google refused access. Check your email is listed under Test users on the consent screen.';
      case 'idpiframe_initialization_failed':
        return 'Google could not start. Third-party cookies may be blocked for this site.';
      case '':
        return 'Sign-in did not complete.';
      default:
        return 'Google said: ' + code;
    }
  }

  /* ---- wait for Google's script tag ---- */
  function gisReady() {
    return new Promise(function (resolve, reject) {
      var tries = 0;
      (function poll() {
        if (window.google && google.accounts && google.accounts.oauth2) return resolve();
        if (++tries > 120) return reject(new Error('Google sign-in script did not load. Check your connection or an ad blocker.'));
        setTimeout(poll, 100);
      })();
    });
  }

  function getClient() {
    if (client) return client;
    client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: function (resp) {
        var p = pending; pending = null;
        if (!p) return;
        if (resp && resp.access_token) {
          writeToken(resp.access_token, resp.expires_in);
          p.resolve(resp.access_token);
        } else {
          p.reject(new Error(explain(resp && resp.error)));
        }
      },
      error_callback: function (err) {
        var p = pending; pending = null;
        if (p) p.reject(new Error(explain(err && (err.type || err.message))));
      }
    });
    return client;
  }

  /* interactive = true shows Google's window; false tries silently and
     fails fast if access was never granted on this browser. */
  function requestToken(interactive) {
    return gisReady().then(function () {
      return new Promise(function (resolve, reject) {
        if (pending) return reject(new Error('A sign-in is already in progress.'));
        pending = { resolve: resolve, reject: reject };
        try {
          getClient().requestAccessToken({ prompt: interactive ? 'consent' : '' });
        } catch (e) {
          pending = null;
          reject(e);
        }
      });
    });
  }

  function getToken(interactive) {
    var cached = readToken();
    if (cached) return Promise.resolve(cached);
    if (!interactive && !localStorage.getItem(LINKED)) {
      return Promise.reject(new Error('Not connected yet.'));
    }
    return requestToken(interactive);
  }

  /* ---- turn a Google event into something the calendar grid can use ---- */
  function normalise(e) {
    var raw = (e.start && (e.start.dateTime || e.start.date)) || '';
    var allDay = !!(e.start && e.start.date && !e.start.dateTime);
    /* An all-day date is "2026-07-28". Parsing that bare would land on UTC
       midnight and can slip to the previous day in some timezones. */
    var start = allDay ? new Date(raw + 'T00:00:00') : new Date(raw);
    return {
      id: e.id,
      title: e.summary || 'Untitled event',
      start: start,
      allDay: allDay,
      timeLabel: allDay ? 'All day' : start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      location: e.location || '',
      calendar: e.organizer && e.organizer.displayName || ''
    };
  }

  /* Read the list of calendars in the account, then pull events from all of
     them. Family events often sit on a shared calendar, not the main one. */
  function listCalendars(token) {
    return fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=reader&maxResults=100', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(function (r) {
      if (r.ok) return r.json();
      if (r.status === 401) { clearToken(); throw new Error('Google access expired. Connect again.'); }
      if (r.status === 403) { throw new Error('Google blocked the request. The Calendar API is probably not switched on in your Cloud project.'); }
      throw new Error('Google returned an error (' + r.status + ').');
    }).then(function (data) {
      return (data.items || []).filter(function (c) { return !c.deleted; });
    });
  }

  function eventsFrom(token, calId, from, to) {
    var url = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calId) + '/events'
      + '?singleEvents=true&orderBy=startTime&maxResults=250'
      + '&timeMin=' + encodeURIComponent(from.toISOString())
      + '&timeMax=' + encodeURIComponent(to.toISOString());
    return fetch(url, { headers: { Authorization: 'Bearer ' + token } })
      .then(function (r) { return r.ok ? r.json() : { items: [] }; })
      .then(function (d) { return d.items || []; })
      .catch(function () { return []; });
  }

  /* Resolves to { events: [...], report: "Home 4 · Work 2" } */
  function listEvents(from, to, interactive) {
    return getToken(interactive).then(function (token) {
      return listCalendars(token).then(function (cals) {
        if (!cals.length) return { events: [], report: 'No calendars found on this account.' };
        return Promise.all(cals.map(function (c) {
          return eventsFrom(token, c.id, from, to).then(function (items) {
            return { name: c.summary || c.id, items: items.map(normalise) };
          });
        })).then(function (groups) {
          var events = [];
          groups.forEach(function (g) {
            g.items.forEach(function (e) { e.calendar = g.name; events.push(e); });
          });
          events.sort(function (a, b) { return a.start - b.start; });
          var report = groups.map(function (g) { return g.name + ' ' + g.items.length; }).join(' \u00b7 ');
          return { events: events, report: report };
        });
      });
    });
  }

  function signOut() {
    var token = readToken();
    clearToken();
    if (token && window.google && google.accounts && google.accounts.oauth2) {
      try { google.accounts.oauth2.revoke(token, function () {}); } catch (x) {}
    }
  }

  window.HX_GCAL = {
    clientId: CLIENT_ID,
    listEvents: listEvents,
    signOut: signOut,
    hasToken: function () { return !!readToken(); },
    wasLinked: function () { try { return !!localStorage.getItem(LINKED); } catch (x) { return false; } }
  };
})();
