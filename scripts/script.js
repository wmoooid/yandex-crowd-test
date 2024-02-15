document.addEventListener('DOMContentLoaded', {});

initSlider(document.querySelector('.section-members__inner-wrapper'), {
    infinite: true,
    markers: false,
    // autoplay: 4000,
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

    const slidesOnScreen = 3;
    const bufferLength = options.infinite ? 3 : 0;
    let currentPosition = 0;
    let autoPlayInterval = null;
    const sliderLength = slider.children.length + bufferLength;

    initSlider();

    if (options.autoplay) {
        autoPlay('start');
        wrapper.addEventListener('mouseenter', () => autoPlay('stop'));
        wrapper.addEventListener('mouseleave', () => autoPlay('start'));
    }

    buttonLeft.addEventListener('click', () => makeTransition(-1));
    buttonRight.addEventListener('click', () => makeTransition(+1));
    window.addEventListener('resize', () => updateSliderPosition(false));

    function autoPlay(command) {
        if (command === 'start') autoPlayInterval = setInterval(() => makeTransition(+1), options.autoplay);
        if (command === 'stop') clearInterval(autoPlayInterval);
    }

    function initSlider() {
        if (options.markers) {
            Array.from(slider.children).forEach(() => {
                const marker = document.createElement('span');
                marker.classList.add('slider-marker');
                markerList.appendChild(marker);
            });
        } else {
            lengthCounter.textContent = sliderLength - bufferLength;
        }

        if (options.infinite) {
            const nodesArr = Array.from(slider.children);
            nodesArr.slice(0, bufferLength).forEach((el) => slider.append(el.cloneNode(true)));
            nodesArr
                .slice(-bufferLength)
                .reverse()
                .forEach((el) => slider.prepend(el.cloneNode(true)));
            currentPosition = bufferLength;
            updateSliderPosition(false);
        }

        updateCount();
        updateControls();
    }

    function updateCount() {
        console.log(currentPosition, sliderLength);
        if (currentPosition >= sliderLength) {
            options.markers ? updateMarker(1) : (currentCounter.textContent = 1);
            return;
        }

        if (currentPosition < bufferLength) {
            options.markers ? updateMarker(sliderLength - bufferLength) : (currentCounter.textContent = sliderLength - bufferLength);
            return;
        }

        options.markers ? updateMarker(currentPosition - bufferLength + 1) : (currentCounter.textContent = currentPosition - bufferLength + 1);
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

    function updateSliderPosition(withTransition = true) {
        const offset = slider.children[0].clientWidth + 20;
        slider.style.transition = withTransition ? 'transform 500ms cubic-bezier(0.45, 1.45, 0.8, 1)' : '';
        slider.style.transform = `translateX(${-offset * currentPosition}px)`;
    }

    function makeTransition(dir) {
        currentPosition += dir;

        if (currentPosition <= 1) {
            currentPosition = sliderLength - 1;
            updateSliderPosition(false);
            --currentPosition;
        }

        if (currentPosition >= sliderLength - 1) {
            currentPosition = bufferLength - 2;
            updateSliderPosition(false);
            ++currentPosition;
        }

        setTimeout(updateSliderPosition);
        updateCount();
        updateControls();
    }
}
