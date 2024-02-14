document.addEventListener('DOMContentLoaded', {});

initSlider(document.querySelector('.section-members__inner-wrapper'), {
    infinite: true,
    markers: false,
    autoplay: 4000,
});

initSlider(document.querySelector('.section-stages__main'), {
    infinite: false,
    markers: true,
});

function initSlider(wrapper, options) {
    const slider = wrapper.querySelector('[aria-label="slider"]');
    const buttonLeft = wrapper.querySelector('[aria-label="button-prev"]');
    const buttonRight = wrapper.querySelector('[aria-label="button-next"]');
    const currentCounter = wrapper.querySelector('[aria-label="current-counter"]');
    const lengthCounter = wrapper.querySelector('[aria-label="length-counter"]');
    const markerList = wrapper.querySelector('[aria-label="marker-list"]');

    let shouldWait = false;
    let currentPosition = 0;
    const sliderLength = slider.children.length;

    initSlider();

    buttonLeft.addEventListener('click', () => makeTransition(-1));
    buttonRight.addEventListener('click', () => makeTransition(+1));
    window.addEventListener('resize', () => {
        UpdateSliderPosition(false);
        shouldWait = false;
    });

    if (options.autoplay) setInterval(() => makeTransition(+1), options.autoplay);

    function initSlider() {
        if (options.markers) {
            Array.from(slider.children).forEach(() => {
                const marker = document.createElement('span');
                marker.classList.add('slider-marker');
                markerList.appendChild(marker);
            });
        } else {
            lengthCounter.textContent = sliderLength;
        }

        if (options.infinite) {
            slider.querySelectorAll('li').forEach((el, i) => {
                if (i < 3) {
                    slider.appendChild(el.cloneNode(true));
                }
            });
        }

        updateCount();
        updateControls();
    }

    function updateCount() {
        if (currentPosition >= sliderLength) {
            options.markers ? updateMarker(1) : (currentCounter.textContent = 1);
            return;
        }

        if (currentPosition < 0) {
            options.markers ? updateMarker(sliderLength) : (currentCounter.textContent = sliderLength);
            return;
        }

        options.markers ? updateMarker(currentPosition + 1) : (currentCounter.textContent = currentPosition + 1);
    }

    function updateControls() {
        if (options.infinite) return;

        buttonLeft.removeAttribute('disabled');
        buttonRight.removeAttribute('disabled');

        if (currentPosition >= sliderLength - 1) buttonRight.setAttribute('disabled', 'true');

        if (currentPosition <= 0) buttonLeft.setAttribute('disabled', 'true');
    }

    function updateMarker(position) {
        Array.from(markerList.children).forEach((el) => (el.style.opacity = ''));
        markerList.children[position - 1].style.opacity = 1;
    }

    function UpdateSliderPosition(withTransition = true) {
        const offset = slider.children[0].clientWidth + 20;
        slider.style.transition = withTransition ? 'transform 500ms cubic-bezier(0.45, 1.45, 0.8, 1)' : '';
        slider.style.transform = `translateX(${-offset * currentPosition}px)`;
    }

    function makeTransition(dir) {
        if (shouldWait) return;
        shouldWait = true;

        currentPosition += dir;

        if (currentPosition < 0) {
            currentPosition = sliderLength;
            UpdateSliderPosition(false);
            --currentPosition;
        }

        setTimeout(UpdateSliderPosition);
        updateCount();
        updateControls();

        slider.addEventListener(
            'transitionend',
            () => {
                shouldWait = false;
                if (currentPosition === sliderLength) {
                    currentPosition = 0;
                    UpdateSliderPosition(false);
                }
            },
            { once: true },
        );
    }
}
