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

    const startAnimation = (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
            if (isIntersecting) {
                const { animation, animationDelay } = target.dataset;
                target.classList.add('with-animation');
                target.style.animation = `${animation} 750ms cubic-bezier(0.45, 1.45, 0.8, 1) ${animationDelay} forwards`;
                observer.unobserve(target);
            }
        });
    };

    const observer = new IntersectionObserver(startAnimation);
    const options = { root: null, rootMargin: '-500px', threshold: 1 };

    document.querySelectorAll('[data-animation]').forEach((element) => {
        element.style.opacity = '0';
        observer.observe(element, options);
    });
})();
