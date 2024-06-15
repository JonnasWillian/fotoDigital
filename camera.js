(function () {
    if (
        !'mediaDevices' in navigator ||
        !'getUserMedia' in navigator.mediaDevices
    ) {
        alert('A câmera não está disponível no seu navegador');
        return;
    }

    // Pegando os elementos
    const video = document.querySelector('#video');
    const btnPlay = document.querySelector('#btnPlay');
    const btnPause = document.querySelector('#btnPause');
    const btnScreenshot = document.querySelector('#btnScreenshot');
    const btnChangeCamera = document.querySelector('#btnChangeCamera');
    const screenshotsContainer = document.querySelector('#screenshots');
    const canvas = document.querySelector('#canvas');
    const devicesSelect = document.querySelector('#devicesSelect');
    const imagemInput = document.querySelector('#imagem');

    const constraints = {
        video: {
        width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440,
        },
        },
    };

    // Usando câmera frontal
    let useFrontCamera = true;

    // Usando câmera traseira
    let videoStream;

    // Iniciar
    btnPlay.addEventListener('click', function () {
        video.play();
        btnPlay.classList.add('is-hidden');
        btnPause.classList.remove('is-hidden');
    });

    // Pausar
    btnPause.addEventListener('click', function () {
        video.pause();
        btnPause.classList.add('is-hidden');
        btnPlay.classList.remove('is-hidden');
    });

    // Tirar foto
    btnScreenshot.addEventListener('click', function () {
        screenshotsContainer.innerHTML = '';
        const img = document.createElement('img');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/png');
        img.src = imageDataUrl;
        screenshotsContainer.prepend(img);

        fetch(imageDataUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'screenshot.png', { type: 'image/png' });

                // Criar um DataTransfer para simular a seleção do arquivo
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                imagemInput.files = dataTransfer.files;
        });
    });

    // Trocando câmera
    btnChangeCamera.addEventListener('click', function () {
        useFrontCamera = !useFrontCamera;

        initializeCamera();
    });

    // Parando foto
    function stopVideoStream() {
        if (videoStream) {
        videoStream.getTracks().forEach((track) => {
            track.stop();
        });
        }
    }

    // Carregando câmera
    async function initializeCamera() {
        stopVideoStream();
        constraints.video.facingMode = useFrontCamera ? 'user' : 'environment';

        try {
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = videoStream;
        } catch (err) {
        alert('Não foi possível acessar a câmera.');
        }
    }

    initializeCamera();
})();