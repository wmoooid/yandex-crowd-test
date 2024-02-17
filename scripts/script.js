(() => {
    class Slider {
        constructor(wrapper, options) {
            this.wrapper = wrapper;
            this.options = options;

            this.slider = this.wrapper.querySelector('[aria-label="slider"]');
            this.buttonLeft = this.wrapper.querySelector('[aria-label="button-prev"]');
            this.buttonRight = this.wrapper.querySelector('[aria-label="button-next"]');
            this.currentCounter = this.wrapper.querySelector('[aria-label="current-counter"]');
            this.lengthCounter = this.wrapper.querySelector('[aria-label="length-counter"]');
            this.markerList = this.wrapper.querySelector('[aria-label="marker-list"]');
            this.sliderPosition = 0;
            this.autoPlayInterval = null;
            this.slidesOnScreen = 3;
            this.sliderArr = Array.from(this.slider.children);
            this.sliderLength = this.sliderArr.length;

            this.init();
            this.addEventListeners();
        }

        init() {
            if (this.options.markers) {
                this.createMarkers();
            }
            this.addSliderClasses();
            this.updateState();
            if (this.options.autoplay) {
                this.autoPlay('start');
                this.wrapper.addEventListener('mouseenter', () => this.autoPlay('stop'));
                this.wrapper.addEventListener('mouseleave', () => this.autoPlay('start'));
            }
        }

        addSliderClasses() {
            this.sliderArr.forEach((el) => el.classList.add('slider__item'));
        }

        createMarkers() {
            this.sliderArr.forEach((el, i) => {
                const marker = document.createElement('span');
                marker.classList.add('slider__marker');
                this.markerList.appendChild(marker);
                marker.addEventListener('click', () => {
                    this.sliderPosition = i;
                    this.updateState();
                });
            });
        }

        arrangeSlides() {
            this.sliderArr.forEach((el, i) => {
                const position = this.getSlidePosition(i);
                el.style.setProperty('--position', position);
                el.classList.toggle('hide', position < 0 || position >= this.slidesOnScreen);
            });
        }

        updateCounter() {
            if (this.options.markers) {
                Array.from(this.markerList.children).forEach((el, i) => (el.style.opacity = i === this.sliderPosition ? 1 : ''));
            } else {
                this.currentCounter.textContent = this.sliderPosition + 1;
                this.lengthCounter.textContent = this.sliderLength;
            }
        }

        updateControls() {
            if (this.options.infinite) return;

            this.buttonLeft.toggleAttribute('disabled', this.sliderPosition === 0);
            this.buttonRight.toggleAttribute('disabled', this.sliderPosition === this.sliderLength - 1);
        }

        updateState() {
            this.arrangeSlides();
            this.updateCounter();
            this.updateControls();
        }

        getSlidePosition(index) {
            const leftSidePosition = this.sliderPosition;
            const rightSidePosition = this.correctIndex(this.sliderPosition + this.slidesOnScreen - 1);

            const nextOnLeft = this.correctIndex(leftSidePosition - 1);
            const nextOnRight = this.correctIndex(rightSidePosition + 1);

            if (index === nextOnLeft) return -1;
            if (index === nextOnRight) return this.slidesOnScreen;

            return this.correctIndex(index - this.sliderPosition);
        }

        makeTransition(direction) {
            this.sliderPosition = this.correctIndex(this.sliderPosition + direction);
            this.updateState();
        }

        correctIndex(index) {
            return (index + this.sliderLength) % this.sliderLength;
        }

        autoPlay(command) {
            if (command === 'start') this.autoPlayInterval = setInterval(() => this.makeTransition(+1), this.options.autoplay);
            if (command === 'stop') clearInterval(this.autoPlayInterval);
        }

        addEventListeners() {
            this.buttonLeft.addEventListener('click', () => this.makeTransition(-1));
            this.buttonRight.addEventListener('click', () => this.makeTransition(+1));
        }
    }

    const slidersConfig = [
        { selector: '.section-members__inner-wrapper', options: { infinite: true, markers: false, autoplay: 4000 } },
        { selector: '.section-stages__main', options: { infinite: false, markers: true } },
    ];

    slidersConfig.forEach(({ selector, options }) => {
        const wrapper = document.querySelector(selector);
        new Slider(wrapper, options);
    });

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
