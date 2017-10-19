<!DOCTYPE html>
<html>
<head>
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>PWA</title>
  <link rel="stylesheet" type="text/css" href="{!! asset('css/app.css') !!}">
</head>
<body>
  <div id="app">
    
  </div>
  <div id="connectionStatus"></div>
  <p>Click me to make messages request</p>
  <button id="requestMsgButton">Make Msg request</button>
  <p>Click me to make transaction request</p>
  <button id="requestTransButton">Make Transaction request</button>

  <script type="text/javascript">
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('service-worker.js');
    }
    document.getElementById('requestMsgButton')
      .addEventListener('click', () => {
        fetch('/messages')
      });
    document.getElementById('requestTransButton')
      .addEventListener('click', () => {
        fetch('/transactions')
      });
  </script>
  <script type="text/javascript" src="{!! asset('js/app.js') !!}"></script>
</body>
</html>