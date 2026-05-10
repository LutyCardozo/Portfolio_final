const routeSteps = document.querySelectorAll('.route-step');



if (routeSteps.length) {
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    routeSteps.forEach((step) => {
        stepObserver.observe(step);
    });
}