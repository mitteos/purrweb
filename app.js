const imgAll = document.querySelectorAll('.slider__container img');
const slideWidth = document.querySelector('.slider__container img').clientWidth;
const sliderSpeed = slideWidth / 128;
const pagination = document.querySelector('.slider__pagination');
const container = document.querySelector('.slider__container');
const buttons = document.querySelectorAll('.btn');
const imageSrc = [];
let step = 0;


imgAll.forEach(img => {
    imageSrc.push(img.src);
    pagination.append(document.createElement('span'));
    img.remove();
})
const dots = pagination.querySelectorAll('span');
dots[0].classList.add('active');


const nextDraw = (next = false) => {
    let offset = !next ? 0 : 1;
    for (let i = 0; i < imageSrc.length; i++) {
        let img = document.createElement('img');
        img.src = imageSrc[i];
        img.style.left = offset * slideWidth + 'px';
        container.append(img)
        offset++;
    }
}

const prevDraw = () => {
    let offset2 = 1;
    for (let i = imageSrc.length - 1; i > -1; i--) {
        let img = document.createElement('img');
        img.src = imageSrc[i];
        img.style.left = offset2 * -slideWidth + 'px';
        container.prepend(img)
        offset2++;
    }
}
prevDraw()
nextDraw()

const selectedDot = (num) => {
    dots.forEach(e => e.classList.remove('active'))
    dots[num].classList.add('active');
}


const timerFunc = (elem, newLeft) => {
    let startLeft = parseInt(getComputedStyle(elem)['left'], 10);
    if (startLeft < newLeft) {
        let timerIdLeft = setInterval(() => {
            startLeft += sliderSpeed;
            elem.style.left = startLeft + 'px';
            if (startLeft === newLeft) {
                clearInterval(timerIdLeft)
                buttons[0].addEventListener('click', left);
                pagination.addEventListener('click', dotsFun)
            }
        }, 1)

    }
    if (startLeft > newLeft) {
        let timerIdRight = setInterval(() => {
            startLeft -= sliderSpeed;
            elem.style.left = startLeft + 'px';
            if (startLeft === newLeft) {
                clearInterval(timerIdRight)
                buttons[1].addEventListener('click', right);
                pagination.addEventListener('click', dotsFun)
            }
        }, 1)
    }
}


const right = () => {
    buttons[1].removeEventListener('click', right, false)
    const img = document.querySelectorAll('.slider__container img');

    if (step + 1 > imageSrc.length - 1) {
        step = 0;
    } else step++;

    let items = document.querySelectorAll('.slider__container img');
    if (step === 1 && items.length > imageSrc.length) {
        for (let i = 0; i < imageSrc.length; i++) {
            items[i].remove();
        }
    }
    if (step === imageSrc.length - 1) setTimeout(() => nextDraw(true), 300)

    selectedDot(step);
    step === imageSrc.length - 1
        ? lock = false
        : lock = true
    img.forEach(e => {
        timerFunc(e, parseInt(getComputedStyle(e)['left'], 10) - slideWidth)
    })
}

const left = () => {
    buttons[0].removeEventListener('click', left, false)
    let img = document.querySelectorAll('.slider__container img');

    if (step - 1 < 0) step = imageSrc.length - 1
    else step--;

    if (step === 0) setTimeout(() => {
        prevDraw()
    }, 300)

    if (step === imageSrc.length - 2) {
        let items = document.querySelectorAll('.slider__container img');
        for (let i = imageSrc.length; i < items.length; i++) {
            items[i].remove();
        }
    }
    selectedDot(step);
    step === 0 ? lock = true : lock = false
    img.forEach(e => {
        timerFunc(e, parseInt(getComputedStyle(e)['left'], 10) + slideWidth)
    })
}

const dotsFun = (e) => {
    if (!e.target.classList.contains('active') && !e.target.classList.contains('slider__pagination')) {
        swipe(Object.entries(pagination.querySelectorAll('span')).flat().filter(e => typeof e != 'string').indexOf(e.target))
    }
}
pagination.addEventListener('click', dotsFun)

const swipe = (num) => {
    pagination.removeEventListener('click', dotsFun)
    let diff = num - step;
    let items = document.querySelectorAll('.slider__container img');

    items.forEach((e) => {
        timerFunc(e, parseInt(getComputedStyle(e)['left'], 10) - (diff * slideWidth))
    })
    selectedDot(num);
    step = num;
    examination();
}

let lock = true;
const examination = () => {
    let items = document.querySelectorAll('.slider__container img');
    if (items.length > imageSrc.length) {
        if (lock) {
            for (let i = 0; i < imageSrc.length; i++) {
                items[i].remove();
            }
        } else {
            for (let i = items.length - 1; i > imageSrc.length - 1; i--) {
                items[i].remove();
            }
        }
    }
    step === imageSrc.length - 1
        ? lock = false
        : lock = true;

    if (step === 0) setTimeout(() => prevDraw(), 100)
    if (step === imageSrc.length - 1) setTimeout(() => nextDraw(true), 100)
}


if (imageSrc.length > 1) {
    buttons[0].addEventListener('click', left)
    buttons[1].addEventListener('click', right)
}