# rooverlay
[![npm version](https://badge.fury.io/js/rooverlay.svg)](https://www.npmjs.com/package/rooverlay) [![Build Status](https://travis-ci.org/Tickaroo/rooverlay.svg?branch=master)](https://travis-ci.org/Tickaroo/rooverlay) [![codecov.io](https://codecov.io/github/Tickaroo/rooverlay/coverage.svg?branch=master)](https://codecov.io/github/Tickaroo/rooverlay?branch=master)

Overlay library that displays image/video galleries, html or iframes.

#### Dependencies

This library has no dependencies and still weights just ~15 KB unminified.

#### Compatibility

Recent browsers such as: IE 8+, Safari, Firefox & Chrome.


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

#### `new Rooverlay(options)`:

- **`options`**:
  - **`closeOnOverlayClick`**: Closes slideshow on overlay background click. (default `false`)
  - **`slideIndex`**: Initial start index of the slideshow slides. (default `0`)
  - **`loop`**: Loops slideshow. (default `false`)
  - **`skin`**: Slideshow layout skin, possible values are `'light'` and `'dark'` (default `'dark'`, `undefined`)
  - **`pagination`**: Shows pagination. (default `false`)
  - **`container`**: Element slideshow will be appended to. (default `document.body`)
  - **`disableKeyboardControls`**: Disable keyboard arrow key controls to go forward or back and the "escape" key to close the overlay. (default `false`)
  - **`onBeforeClose`**: Callback after closing the overlay. (default `undefined`)
  - **`onAfterSlideRender`**: Callback after slide renders. (default `undefined`)
  - **`onBeforeSlideRender`**: Callback before slide renders. (default `undefined`)
  - **`i18n`**:
    Text displayed to the user.
    (type `PlainObject`)
    - **`missing`**: Appears when content can't be loaded. (default `'Missing'`)
  - **`slides`**:
    Slides that will be displayed in the overlay.
    (type `Array<PlainObject>` default `[]`)  

  #### Image slide:
    - **`type`**: `'image'`
    - **`src`**: Image url. (default `undefined`)
    - **`width`**: Maximal image width. (default dynamic image width)
    - **`height`**: Maximal image height. (default dynamic image height)
    - **`minWidth`**: Minimal image width, if window size allows it. (default `300`)
    - **`minHeight`**: Minimal image height, if window size allows it. (default `300`)
    - **`aspectRatio`**: Whether or not to respect image size ratio on resize. (default `true`)
    - **`description`**: Description text/HTML string appended to the content element. (default `undefined`)
    - **`title`**: Title text/HTML string appended to the top row title element. (default `undefined`)

  #### Video iframe slide:
    - **`type`**: `'iframe-video'`
    - **`src`**: Iframe url. (default `undefined`)
    - **`width`**: Maximal iframe width. (default `800`)
    - **`height`**: Maximal iframe height. (default `450`)
    - **`minWidth`**: Minimal iframe width, if window size allows it. (default `undefined`)
    - **`minHeight`**: Minimal iframe height, if window size allows it. (default `undefined`)
    - **`aspectRatio`**: Whether or not to respect iframe size ratio on resize. (default `true`)
    - **`description`**: Same as in `image`
    - **`title`**: Same as in `image`

  #### Iframe slide:
    - **`type`**: `'iframe'`
    - **`src`**: Iframe url. (default `undefined`)
    - **`width`**: Maximal iframe width. (default `800`)
    - **`height`**: Maximal iframe height. (default `450`)
    - **`minWidth`**: Minimal iframe width, if window size allows it. (default `undefined`)
    - **`minHeight`**: Minimal iframe height, if window size allows it. (default `undefined`)
    - **`aspectRatio`**: Whether or not to respect iframe size ratio on resize. (default `false`)

  #### HTML slide:
    - **`type`**: `'html'`
    - **`html`**: HTML string that will be set inside the content element. (default `undefined`)
    - **`content`**: If `'html'` isn't set: DOM element that will be inserted to the content element. (default `undefined`)
    - **`width`**: Maximal HTML width. (default `600`)
    - **`height`**: Maximal HTML height. (default `undefined`)
    - **`minWidth`**: Minimal html width, if window size allows it. (default `undefined`)
    - **`minHeight`**: Minimal html height, if window size allows it. (default `undefined`)
    - **`aspectRatio`**: Whether or not to respect html size ratio on resize. (default `false`)


#### `instance.updateOptions(options, rerender)`:

Update the initial options.

- **`options`**: Same as in initialization.
- **`rerender`**: Will re-render slideshow with new settings. (default `false`)


#### `instance.nextSlide()`:

Go to the next slide.

#### `instance.previousSlide()`:

Go to the previous slide.

#### `instance.jumpToSlide(index)`:

Jump to the index. (default `0`)

#### `instance.showLoading()`:

Show loading spinner.

#### `instance.hideLoading()`:

Hides loading spinner.

#### `instance.destroy()` or `instance.close()`:

Close the overlay, remove it from the DOM and remove the event listeners, like `resize`.


## CSS

### Links

```sass
@import "~rooverlay/src/index.scss"
@import "~rooverlay/src/images.scss"
```

### Classes

- **`.rooverlay-overlay`**: Overlay background-color
- **`.rooverlay-description`**: Description box color, background-color and padding
