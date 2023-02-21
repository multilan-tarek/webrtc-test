let your_id;
let peer_id;
let conn;
let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
let peer;

function connect() {
    if (peer) {
        conn = peer.connect(peer_id);
        console.log(conn)

        conn.on('open', function () {
            console.log("Connection opened to " + peer_id)
            conn.send('Hello ' + peer_id);
        });
    } else {
        console.error("IDs not set")
    }
}

function call() {
    if (conn) {
        getUserMedia({video: true, audio: true}, function (stream) {
            let call = peer.call(peer_id, stream);
            call.on('stream', function (remoteStream) {
                console.log("Call ongoing with " + peer_id)
            });
        }, function (err) {
            console.log('Failed to get local stream', err);
        });
    } else {
        console.error("Not connected to peer")
    }
}


function saveIds() {
    console.log("IDs saved!")
    your_id = document.getElementById("your-id").value;
    peer_id = document.getElementById("peer-id").value;

    peer = new Peer(your_id, {
        host: '10.0.10.5',
        port: 9000,
        path: '/myapp'
    });

    peer.on('call', function (call) {
        console.log("Call incoming")

        getUserMedia({video: true, audio: true}, function (stream) {

            call.answer(stream);
            let audio1 = document.getElementById('audio1');
            audio1.srcObject = stream;
            audio1.play();
            call.on('stream', function (remoteStream) {
                let audio2 = document.getElementById('audio1');
                audio2.srcObject = remoteStream;
                audio2.play();
                console.log("Call answered")
            });

        }, function (err) {
            console.log('Failed to get local stream', err);
        });
    });

    peer.on('connection', function (conn) {
        console.log("Connection received")
        conn.on('data', function (data) {
            console.log("Data from peer:")
            console.log(data);
        });
    });
}