gsap.to("#bg",{
    scrollTrigger:{
        scrub:1
    },
    scale:1.5
})
gsap.to("#valak",{
    scrollTrigger:{
        scrub:1
    },
    scale:0.5
})
gsap.to("#rayo1",{
    scrollTrigger:{
        scrub:1
    },
    x:-200
})
gsap.to("#rayo2",{
    scrollTrigger:{
        scrub:1
    },
    x:200
})
gsap.to("#text",{
    scrollTrigger:{
        scrub:1
    },
    y:500
})



//instalar app
window.addEventListener('DOMContentLoaded', () => {
    //registrar el ayuwokin
    if('serviceWorker' in navigator){
        navigator.serviceWorker
        .register('Service_Worker.js')
        .then(respuesta => console.log('Sw registrado correctamente'))
        .catch(error => console.log('sw no se pudo registrar'))
    }
    
    let eventInstall;
    let btnInstall = document.querySelector(".btnInstall");

    let InstallApp = () => {
        if(eventInstall){
            eventInstall.prompt();
            eventInstall.userChoice
            .then(res => {
                if(res.outcome === "accepted"){
                    console.log("el user acepto instalar mi super app");
                    btnInstall.style.display = "none";
                }else{
                     alert("como que no?");
                }
            })
        }
    }
    
    window.addEventListener("beforeinstallprompt", (e) => {
        
        e.preventDefault();
        eventInstall = e;
        showInstallButton();
    })

    let showInstallButton = () => {
        if(btnInstall != undefined){
            btnInstall.style.display = "inline-block";
            btnInstall.addEventListener("click", InstallApp)
        }
    }
});