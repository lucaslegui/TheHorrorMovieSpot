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

gsap.registerPlugin(ScrollTrigger);

gsap.from(".sec", {
  duration: 5,
  y: 50,
  opacity: 0,
  ease: "power1.out",
  scrollTrigger: {
    trigger: ".sec",
    start: "top 80%",
    toggleActions: "play none none none" 
  }
});