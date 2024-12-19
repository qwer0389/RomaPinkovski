gsap.utils.toArray('.swiper-wrapper').forEach((line, i) => {
  
    const speed = 200 // (in pixels per second)
    
    const links = line.querySelectorAll("a"),
          tl = verticalLoop(links, i ? -speed : speed)
      
    links.forEach(link => {
      link.addEventListener("mouseenter", () => gsap.to(tl, {timeScale: 0, overwrite: true}));
      link.addEventListener("mouseleave", () => gsap.to(tl, {timeScale: 1, overwrite: true}));
    });
    
  });
  
  
  
  
  // speed can be positive or negative (in pixels per second)
  function verticalLoop(elements, speed) {
    elements = gsap.utils.toArray(elements);
    let firstBounds = elements[0].getBoundingClientRect(),
        lastBounds = elements[elements.length - 1].getBoundingClientRect(),
        top = firstBounds.top - firstBounds.height - Math.abs(elements[1].getBoundingClientRect().top - firstBounds.bottom),
        bottom = lastBounds.top,
        distance = bottom - top,
        duration = Math.abs(distance / speed),
        tl = gsap.timeline({repeat: -1}),
        plus = speed < 0 ? "-=" : "+=",
        minus = speed < 0 ? "+=" : "-=";
    elements.forEach(el => {
      let bounds = el.getBoundingClientRect(),
          ratio = Math.abs((bottom - bounds.top) / distance);
      if (speed < 0) {
        ratio = 1 - ratio;
      }
      tl.to(el, {
        y: plus + distance * ratio,
        duration: duration * ratio,
        ease: "none"
      }, 0);
      tl.fromTo(el, {
        y: minus + distance
      }, {
        y: plus + (1 - ratio) * distance,
        ease: "none",
        duration: (1 - ratio) * duration,
        immediateRender: false
      }, duration * ratio)
    });
    return tl;
  }