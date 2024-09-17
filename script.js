'use strict';

///////////////////////////////////////////////////////////////////////////
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

// Scroll to the top of the page on reload
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
///////////////////////////////////////////////////////////////////////////

//! Modal window (Open Account)
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  // Prevent scrolling up to Top (link place)
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Open & Close Modal Event Listeners
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////////////////////////////////////////

//! Scrolling to Features section (Learn more button)
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScroll.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });

  //? Redundant way of scrolling
  // const sec1Coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: sec1Coords.left + window.scrollX,
  //   top: sec1Coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });
});

///////////////////////////////////////////////////////////////////////////

//! Page Navigation using Event Delegation (Navigation Tab)
//? Instead of adding event listener to every single link
//? Add it to common parent -> Use e.target to know which Component exactly clicked
//? Results: 1 Event Listener on Parent (Not 3 "On Each link")

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // To enable smooth scrolling
  e.preventDefault();
  // Matching Strategy -> Ignoring clicks on Irrelevant Parent Element
  if (e.target.classList.contains('nav__link')) {
    // Get destination from link clicked
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////////////////////////////////

//! Page Navigation fade animation
// Using bind to manually set 'this' to wanted opacity
// Don't need opacity parameter
const handleHover = function (e /*,opacity*/) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    //? Move up to parent -> Select all other links
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    //const logo = link.closest('.nav').querySelector('img');
    //logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////////////////////////////

//! Sticky Page Navigation
const navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries) {
  // Observer entries occurring upon threshold requirements
  const [entry] = entries;

  // Entire section not visible in viewport -> isIntersecting becomes false
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // as soon as even one pixel of the target element enters/exits root's viewport
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////////////////////////////////////////

//! Reveal Sections upon scrolling
const allSections = document.querySelectorAll('.section');

function revealSection(entries, observer) {
  const [entry] = entries;

  // Guard clause -> Fixing section 1 always appearing
  if (!entry.isIntersecting) return;

  // Using target property -> Know section that triggered observer
  entry.target.classList.remove('section--hidden');
  // Unobserve section when done -> Enhancing performance
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// Observe every section & add section--hidden class to it
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//! Lazy image loading upon scrolling => Enhancing Performance
const imgTargets = document.querySelectorAll('img[data-src]');

function loadingImg(entries, observer) {
  const [entry] = entries;

  // Guard Clause
  if (!entry.isIntersecting) return;

  // Switch placeholder image with Actual image
  entry.target.src = entry.target.dataset.src;

  // Remove blur filter only when image fully loads -> For when network is slow
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
}
const imgObserver = new IntersectionObserver(loadingImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px', //? Before reaching image -> Seamless performance (Should actually be +200px)
});

imgTargets.forEach(img => imgObserver.observe(img));

//! Tabbed Component (Operations Section)
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  // If number is clicked instead of tab  -> Whole tab is still returned
  const clicked = e.target.closest('.operations__tab');

  //? Guard Clause
  // Clicking empty space between tabs finishes event
  // Instead of error when adding (.operations__tab--active)
  if (!clicked) return;

  // Remove active classes from all elements
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Add to only clicked tab
  clicked.classList.add('operations__tab--active');

  // Activate content area using data-tab from tab clicked
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//! Slider component
function slider() {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Separate slides from being on top of eachother
  slides.forEach(
    (slide, i) => (slide.style.transform = `translateX(${100 * i}%)`)
  );

  //////////////////////////* Functions //////////////////////////////////////

  function goToSlide(slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translate(${100 * (i - slide)}%)`)
    );
  }

  function nextSlide() {
    // At last slide => Go to beginning
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  function prevSlide() {
    // At first slide => Go to end
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  function createDots() {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  function activateDot(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  function init() {
    goToSlide(0);
    createDots();
    activateDot(0);
  }

  init();
  //////////////////////////* Events //////////////////////////////////////
  // Next Slide arrow button
  btnRight.addEventListener('click', nextSlide);
  // Previous Slide arrow button
  btnLeft.addEventListener('click', prevSlide);

  // Arrow Keys on Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // Slider Dots
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
}
slider();
////////////////////////////////////////////////////////////////////////////
// //! Creating Element (Cookies Message)

// // Creating Element
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // Inserting HTML
// message.innerHTML =
//   'We use cookies to improve functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// // Add message as last child of header
// header.append(message);
// // Deleting Elements: Button clicked -> Remove Cookies message
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });
// //* Styles
// // These are inline styles (inserted in html tags)
// message.style.backgroundColor = '#37383d';
// message.style.width = '100%';
// // Getting styles
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// // Fix Cookie message to screen bottom
// message.style.position = 'fixed';
// message.style.bottom = 0;
// message.style.zIndex = 10000;

////////////////////////////////////////////////////////////////////////////
