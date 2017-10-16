<!DOCTYPE html>
<html>
<head>
    <title>PWA</title>
    <link rel="stylesheet" type="text/css" href="{!! asset('css/app.css') !!}">
</head>
<body>
  <div id="connectionStatus"></div>
  <p>Click me to make Http request</p>
  <button id="requestButton">Make A request</button>

  <script type="text/javascript">
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('service-worker.js');
    }
    document.getElementById('requestButton')
      .addEventListener('click', () => {
        fetch('/messages')
          .then((response)=> console.log(response))
          .catch((e) => console.log(e));
      });
  </script>
</body>
</html>