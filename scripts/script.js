(() => {
    const slidersConfig = [
        { selector: '.section-members__inner-wrapper', options: { infinite: true, markers: false, autoplay: 4000 } },
        { selector: '.section-stages__main', options: { infinite: false, markers: true } },
    ];

    slidersConfig.forEach(({ selector, options }) => {
        const wrapper = document.querySelector(selector);
        initSlider(wrapper, options);
    });

    function initSlider(wrapper, options) {
        const slider = wrapper.querySelector('[aria-label="slider"]');
        const buttonLeft = wrapper.querySelector('[aria-label="button-prev"]');
        const buttonRight = wrapper.querySelector('[aria-label="button-next"]');
        const currentCounter = wrapper.querySelector('[aria-label="current-counter"]');
        const lengthCounter = wrapper.querySelector('[aria-label="length-counter"]');
        const markerList = wrapper.querySelector('[aria-label="marker-list"]');

        let sliderPosition = 0;
        let autoPlayInterval = null;
        const slidesOnScreen = 3;
        const sliderArr = Array.from(slider.children);
        const sliderLength = sliderArr.length;

        init();

        if (options.autoplay) {
            autoPlay('start');
            wrapper.addEventListener('mouseenter', () => autoPlay('stop'));
            wrapper.addEventListener('mouseleave', () => autoPlay('start'));
        }

        buttonLeft.addEventListener('click', () => makeTransition(-1));
        buttonRight.addEventListener('click', () => makeTransition(+1));

        function init() {
            if (options.markers) {
                createMarkers();
            }

            addSliderClasses();
            updateState();
        }

        function addSliderClasses() {
            sliderArr.forEach((el) => el.classList.add('slider__item'));
        }

        function createMarkers() {
            sliderArr.forEach((el, i) => {
                const marker = document.createElement('span');
                marker.classList.add('slider__marker');
                markerList.appendChild(marker);
                marker.addEventListener('click', () => {
                    sliderPosition = i;
                    updateState();
                });
            });
        }

        function arrangeSlides() {
            sliderArr.forEach((el, i) => {
                const position = getSlidePosition(i);
                el.style.setProperty('--position', position);
                el.classList.toggle('hide', position < 0 || position >= slidesOnScreen);
            });
        }

        function updateCounter() {
            if (options.markers) {
                Array.from(markerList.children).forEach((el, i) => (el.style.opacity = i === sliderPosition ? 1 : ''));
            } else {
                currentCounter.textContent = sliderPosition + 1;
                lengthCounter.textContent = sliderLength;
            }
        }

        function updateControls() {
            if (options.infinite) return;

            buttonLeft.toggleAttribute('disabled', sliderPosition === 0);
            buttonRight.toggleAttribute('disabled', sliderPosition === sliderLength - 1);
        }

        function updateState() {
            arrangeSlides();
            updateCounter();
            updateControls();
        }

        function getSlidePosition(index) {
            const leftSidePosition = sliderPosition;
            const rightSidePosition = correctIndex(sliderPosition + slidesOnScreen - 1);

            const nextOnLeft = correctIndex(leftSidePosition - 1);
            const nextOnRight = correctIndex(rightSidePosition + 1);

            if (index === nextOnLeft) return -1;
            if (index === nextOnRight) return slidesOnScreen;

            return correctIndex(index - sliderPosition);
        }

        function makeTransition(direction) {
            sliderPosition = correctIndex(sliderPosition + direction);
            updateState();
        }

        function correctIndex(index) {
            return (index + sliderLength) % sliderLength;
        }

        function autoPlay(command) {
            if (command === 'start') autoPlayInterval = setInterval(() => makeTransition(+1), options.autoplay);
            if (command === 'stop') clearInterval(autoPlayInterval);
        }
    }

    const animationsConfig = [
        { selector: '.header__logo', animation: 'fade-in-left', delay: '100ms' },
        { selector: '.section-hero__main-content', animation: 'fade-in', delay: '100ms' },
        { selector: '.section-hero__heading', animation: 'fade-in-up', delay: '500ms' },
        { selector: '.section-hero__text', animation: 'fade-in-up', delay: '700ms' },
        { selector: '.section-hero__cta-wrapper', animation: 'fade-in-up', delay: '900ms' },
        { selector: '.section-support__header', animation: 'fade-in-down', delay: '300ms' },
        { selector: '.section-support__main-image', animation: 'fade-in-down', delay: '500ms' },
        { selector: '.section-support__main-content', animation: 'fade-in-down', delay: '700ms' },
        { selector: '.section-support__table-list', animation: 'fade-in-down', delay: '900ms' },
        { selector: '.section-support__caption', animation: 'fade-in-down', delay: '100ms' },
        { selector: '.section-stages__header', animation: 'fade-in-left', delay: '500ms' },
        { selector: '.section-stages__main', animation: 'fade-in-up', delay: '700ms' },
        { selector: '.section-members__heading', animation: 'fade-in-left', delay: '300ms' },
        { selector: '.section-members__controls-wrapper', animation: 'fade-in-left', delay: '500ms' },
        { selector: '.section-members__main', animation: 'fade-in-up', delay: '700ms' },
    ];

    const startAnimation = (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
            if (isIntersecting) {
                target.classList.add('with-animation');
                target.style.animation = target.animationConfing;
                observer.unobserve(target);
            }
        });
    };

    const observer = new IntersectionObserver(startAnimation);
    const options = { root: null, rootMargin: '-500px', threshold: 1 };

    animationsConfig.forEach(({ selector, animation, delay }) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.animationConfing = `${animation} 750ms cubic-bezier(0.45, 1.45, 0.8, 1) ${delay} forwards`;
            observer.observe(element, options);
        }
    });
})();
