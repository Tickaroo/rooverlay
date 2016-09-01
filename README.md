# rooverlay
[![npm version](https://badge.fury.io/js/rooverlay.svg)](https://www.npmjs.com/package/rooverlay) [![Build Status](https://travis-ci.org/Tickaroo/rooverlay.svg?branch=master)](https://travis-ci.org/Tickaroo/rooverlay) [![codecov.io](https://codecov.io/github/Tickaroo/rooverlay/coverage.svg?branch=master)](https://codecov.io/github/Tickaroo/rooverlay?branch=master)

Overlay library that displays image/video galleries, html or iframes.

#### Dependencies

This library has no dependencies and still weights just ~15 KB unminified.

#### Compatibility

Recent browsers such as : IE 8+, Safari, Firefox & Chrome.


## Install

```bash
$ npm install --save rooverlay
```


## Usage

Below is a example of usage.

#### Image Gallery

```javascript
var Rooverlay = require('rooverlay');

var rooverlay = new Rooverlay({
  loop: true,
  slides: [{
    type: 'image',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
    src: 'rooverlay-1.jpg'
  }, {
    type: 'iframe-video',
    title: 'Roo',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
    src: 'https://d1zucocqrua2yq.cloudfront.net/v2/video/player-frame/50b6675694a940db6d000001/media-00ism10unt4h9ek0ysbr25?autoplay=true'
  }, {
    type: 'image',
    src: 'rooverlay-3.jpg'
  }]
});
```

#### Login Overlay

```javascript
var Rooverlay = require('rooverlay');

var rooverlay = new Rooverlay({
  loop: true,
  slides: [{
    type: 'iframe',
    src: 'https://staging-api.tickaroo.com/oauth/login?response_type=code&client_id=55d34d46e4b0b5f93ed111da&_lang=en'
  }]
});
```

## API

`new Rooverlay(options)`:

- **options**:
  - **closeOnOverlayClick**: Closes slideshow on overlay background click. (default `false`)
  - **loop**: Loops slideshow. (default `false`)
  - **pagination**: Shows pagination. (default `false`)
  - **container**: Element slideshow will be appended to. (default `document.body`)
  - **onBeforeClose**: Callback after closing the overlay. (default `undefined`)
  - **onAfterSlideRender**: Callback after slide renders. (default `undefined`)
  - **onBeforeSlideRender**: Callback before slide renders. (default `undefined`)
  - **i18n**:
    Text displayed to the user.
    (type `PlainObject`)
    - **missing**: Appears when content can't be loaded. (default `'Missing'`)


`instance.updateOptions(options, rerender)`:

Update the initial options.

- **options**: Same as in initialization.
- **rerender**: Will rerender slideshow with new settings. (default `false`)


`instance.nextSlide()`:

Go to the next slide.

`instance.previousSlide()`:

Go to the previous slide.

`instance.jumpToSlide(index)`:

Will jump to the index. (default `0`)


## CSS

### Links

```sass
@import "~rooverlay/src/index.scss"
@import "~rooverlay/src/images.scss"
```

### Classes

- **.rooverlay-overlay**: Overlay background-color
- **.rooverlay-description**: Description box color, background-color and padding
