function noop(){}
function debounce(duration, callback){
  clearTimeout(this.timerDebounce);
  this.timerDebounce = setTimeout(callback, duration);
}

function addEvent(element, eventName, callback){
  if (element.addEventListener){
    element.addEventListener(eventName, callback);
  }
  else {
    element.attachEvent('on' + eventName, callback);
  }
}

function removeEvent(element, eventName, callback){
  if (element.removeEventListener){
    element.removeEventListener(eventName, callback);
  }
  else {
    element.detachEvent('on' + eventName, callback);
  }
}

function Rooverlay(options){
  var wrapperElem = this.wrapperTemplate();
  this.elems = {
    wrapper: wrapperElem,
    pagination: wrapperElem.querySelector('.rooverlay-pagination'),
    content: wrapperElem.querySelector('.rooverlay-content'),
    overlay: wrapperElem.querySelector('.rooverlay-overlay'),
    loader: wrapperElem.querySelector('.rooverlay-loader'),
    title: wrapperElem.querySelector('.rooverlay-title'),
    close: wrapperElem.querySelector('.rooverlay-close'),
    right: wrapperElem.querySelector('.rooverlay-right'),
    left: wrapperElem.querySelector('.rooverlay-left'),
    top: wrapperElem.querySelector('.rooverlay-top'),
    bottom: wrapperElem.querySelector('.rooverlay-bottom')
  };

  this.updateOptions(options);
  this.bindEvents();

  var self = this;
  this.resizeCallback = function(){
    debounce(100, function(){
      self.fit();
    });
  };
  this.keydownCallback = function(e){
    if (e.which === 27){
      e.preventDefault();
      self.destroy();
    }
    if (e.which === 37 || e.which === 38){
      e.preventDefault();
      self.previousSlide();
    }
    if (e.which === 39 || e.which === 40){
      e.preventDefault();
      self.nextSlide();
    }
  };
  addEvent(window, 'resize', this.resizeCallback);
  if ( ! this.options.disableKeyboardControls) {
    addEvent(window, 'keydown', this.keydownCallback);
  }

  this.options.container.appendChild(this.elems.wrapper);
}

Rooverlay.prototype.getCurrentSlide = function getCurrentSlide(){
  return this.options.slides && this.options.slides[this.currentSlideIndex];
};

Rooverlay.prototype.updateSlides = function updateSlides(slides){
  if (slides && slides.length){
    this.lastSlideIndex = slides.length - 1;
    this.options.slides = slides;
  } else {
    this.currentSlideIndex = 0;
    this.lastSlideIndex = 0;
    this.options.slides = [];
  }
};

Rooverlay.prototype.updateSlidesAndRerenderWithIndex = function updateSlidesAndRerender(slides, i){
  this.updateSlides(slides);
  if (this.options.slides.length && i !== undefined){
    this.jumpToSlide(i);
  }
};

Rooverlay.prototype.updateOptions = function updateOptions(options){
  options = options || {};
  this.options = {
    closeOnOverlayClick: options.closeOnOverlayClick,
    skin:       options.skin,
    pagination: options.pagination,
    container:  options.container  || document.body,
    loop:       options.loop,
    i18n:       options.i18n       || {missing: 'Missing'},
    disableKeyboardControls: options.disableKeyboardControls === true,
    onBeforeClose:       options.onBeforeClose       || noop,
    onAfterSlideRender:  options.onAfterSlideRender  || noop,
    onBeforeSlideRender: options.onBeforeSlideRender || noop
  };
  this.updateSlidesAndRerenderWithIndex(options.slides, options.slideIndex || 0);
};

Rooverlay.prototype.wrapperTemplate = function wrapperTemplate(){
  var elem = document.createElement('div');
  elem.className = 'rooverlay-wrapper';
  elem.innerHTML = '\
<div class="rooverlay-overlay"></div>\
<div class="rooverlay-content"></div>\
<a href="#" class="rooverlay-left"></a>\
<a href="#" class="rooverlay-right"></a>\
<div class="rooverlay-top">\
  <div class="rooverlay-top-left">\
    <div class="rooverlay-pagination"></div>\
  </div>\
  <div class="rooverlay-top-center">\
    <div class="rooverlay-title"></div>\
  </div>\
  <div class="rooverlay-top-right">\
    <a href="#" class="rooverlay-close rooverlay-hide"></a>\
  </div>\
</div>\
<div class="rooverlay-bottom"></div>\
<div class="rooverlay-loader rooverlay-hide"></div>';
  return elem;
};

Rooverlay.prototype.fit = function fit(){
  var holderWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var holderHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  var sizeSettings = this._getSizeSettings(this.slide, this.imageElem);
  var size = this._calculateSize(sizeSettings, holderWidth - this.getMarginWidth(), holderHeight - this.getMarginHeight());
  if ( ! size){
    return;
  }

  this.elems.content.style.width = size.width + 'px';
  this.elems.content.style.height = size.height + 'px';
  this.elems.content.style.minWidth = size.minWidth ? (size.minWidth + 'px') : '';
  this.elems.content.style.minHeight = size.minHeight ? (size.minHeight + 'px') : '';

  this.elems.content.style.top = (holderHeight - size.height) / 2 + 'px';
  this.elems.content.style.left = (holderWidth - size.width) / 2 + 'px';
  this._balanceDescriptionHeight();
};

Rooverlay.prototype._balanceDescriptionHeight = function _balanceDescriptionHeight(){
  if (this.slide.description && this.slide.type === 'iframe-video') {
    var descriptionElem = this.elems.content.querySelector('.rooverlay-description');
    if (descriptionElem) {
      this.elems.content.style.marginTop =  ((descriptionElem.offsetHeight * -1) / 2) + 'px';
      return;
    }
  }
  this.elems.content.style.marginTop = '0px';
};

Rooverlay.prototype._getSizeSettings = function _getSizeSettings(slide, imageElem){
  var sizeSettings = {
    height: 0,
    width: 0,
    minWidth: slide.minWidth,
    minHeight: slide.minHeight,
    aspectRatio: false
  };
  switch (slide.type){
    case 'image':
      sizeSettings.width = slide.width || imageElem.naturalWidth || imageElem.width;
      sizeSettings.height = slide.height || imageElem.naturalHeight || imageElem.height;
      sizeSettings.minWidth = sizeSettings.minWidth || 300;
      sizeSettings.minHeight = sizeSettings.minHeight || 300;
      sizeSettings.aspectRatio = slide.aspectRatio || true;
    break;
    case 'iframe-video':
      sizeSettings.width = slide.width || 800;
      sizeSettings.height = slide.height || 450;
      sizeSettings.aspectRatio = slide.aspectRatio || true;
    break;
    default:
      sizeSettings.width = slide.width || 600;
      sizeSettings.height = slide.height || sizeSettings.height;
      sizeSettings.aspectRatio = slide.aspectRatio || false;
    break;
  }
  return sizeSettings;
};

Rooverlay.prototype._calculateSize = function _calculateSize(sizeSettings, holderGlobalWidth, holderGlobalHeight){
  var height, minHeight, width, minWidth;
  var holderGlobalRatio = holderGlobalHeight / holderGlobalWidth;

  if (sizeSettings.aspectRatio){
    if ( ! sizeSettings.height || ! sizeSettings.width){
      return;
    }
    var ratio = (sizeSettings.height / sizeSettings.width);
    if (ratio > holderGlobalRatio){
      height = holderGlobalHeight;
      width = height / ratio;
    }
    else {
      width = holderGlobalWidth;
      height = width * ratio;
    }
    if (width > sizeSettings.width || height > sizeSettings.height){
      width = sizeSettings.width;
      height = sizeSettings.height;
    }
  }
  else {
    if (holderGlobalWidth > sizeSettings.width){
      width = sizeSettings.width;
    }
    else {
      width = holderGlobalWidth;
    }
    height = holderGlobalHeight;
  }

  if (width < sizeSettings.minWidth && sizeSettings.minWidth < holderGlobalWidth) {
    minWidth = sizeSettings.minWidth;
    width = sizeSettings.minWidth;
  }
  if (height < sizeSettings.minHeight && sizeSettings.minHeight < holderGlobalHeight) {
    minHeight = sizeSettings.minHeight;
    height = sizeSettings.minHeight;
  }

  return {
    width: width,
    minWidth: minWidth,
    height: height,
    minHeight: minHeight
  };
};

Rooverlay.prototype.checkArrows = function checkArrows(){
  var hasMany = this.options.slides.length > 1;
  if (this.options.loop && hasMany){
    this.elems.right.className = 'rooverlay-right';
    this.elems.left.className = 'rooverlay-left';
  }
  else if (hasMany){
    // right
    if (this.currentSlideIndex === this.lastSlideIndex){
      this.elems.right.className = 'rooverlay-right rooverlay-hide';
    }
    else {
      this.elems.right.className = 'rooverlay-right';
    }
    // left
    if (this.currentSlideIndex === 0){
      this.elems.left.className = 'rooverlay-left rooverlay-hide';
    }
    else {
      this.elems.left.className = 'rooverlay-left';
    }
  }
  else {
    this.elems.right.className = 'rooverlay-right rooverlay-hide';
    this.elems.left.className = 'rooverlay-left rooverlay-hide';
  }
};

Rooverlay.prototype.bindEvents = function bindEvents(){
  var self = this;
  addEvent(this.elems.left, 'click', function(e){
    e.preventDefault();
    self.previousSlide();
  });
  addEvent(this.elems.right, 'click', function(e){
    e.preventDefault();
    self.nextSlide();
  });
  addEvent(this.elems.close, 'click', function(e){
    e.preventDefault();
    self.destroy();
  });
  if (this.options.closeOnOverlayClick){
    addEvent(this.elems.overlay, 'click', function(e){
      e.preventDefault();
      self.destroy();
    });
  }
};

Rooverlay.prototype.previousSlide = function previousSlide(){
  this.currentSlideIndex--;
  if (this.options.loop){
    if (this.currentSlideIndex < 0){
      this.currentSlideIndex = this.lastSlideIndex;
    }
  }
  this.renderSlide();
};

Rooverlay.prototype.nextSlide = function nextSlide(){
  this.currentSlideIndex++;
  if ( ! this.options.loop){
    if (this.currentSlideIndex > this.lastSlideIndex){
      this.currentSlideIndex = this.lastSlideIndex;
    }
  }
  this.renderSlide();
};

Rooverlay.prototype.jumpToSlide = function jumpToSlide(index){
  this.currentSlideIndex = index || 0;
  this.renderSlide();
};

Rooverlay.prototype.showLoading = function showLoading(){
  this.elems.loader.className = 'rooverlay-loader';
};

Rooverlay.prototype.hideLoading = function hideLoading(){
  this.elems.loader.className = 'rooverlay-loader rooverlay-hide';
};

Rooverlay.prototype.showClose = function showClose(){
  this.elems.close.className = 'rooverlay-close';
};

Rooverlay.prototype.hideClose = function hideClose(){
  this.elems.close.className = 'rooverlay-close rooverlay-hide';
};

Rooverlay.prototype.renderSlide = function renderSlide(){
  var slide = this.getCurrentSlide();
  if ( ! slide){
    if (this.currentSlideIndex !== 0){
      this.currentSlideIndex = 0;
      this.renderSlide();
    }
    return;
  }

  if (this.imageElem){
    this.imageElem.onload = undefined;
    this.imageElem.onerror = undefined;
  }
  if (this.iframeElem){
    this.iframeElem.onload = undefined;
    this.iframeElem.onerror = undefined;
  }

  var skin = '';
  if (this.options.skin === 'light') {
    skin = ' rooverlay-skin-light';
  }
  this.elems.wrapper.className = 'rooverlay-wrapper rooverlay-type-' + slide.type + skin;
  this.checkArrows();

  var self = this;
  this.slide = slide;
  this.options.onBeforeSlideRender();
  switch (slide.type){
    case 'image':
      this.showClose();
      this.showLoading();
      this.imageElem = new window.Image();
      this.imageElem.className = 'rooverlay-img';
      this.imageElem.onload = function(){
        self.elems.content.innerHTML = '';
        self.elems.content.appendChild(self.imageElem);
        self.hideLoading();
        self.appendDescription();
        self.afterSlideRender();
        self.fit();
      };
      this.imageElem.onerror = function(){
        self.elems.content.innerHTML = '<div class="rooverlay-missing">' + self.options.i18n.missing + '</div>';
        self.hideLoading();
        self.afterSlideRender();
        self.fit();
      };
      this.imageElem.src = slide.src;
    break;
    case 'iframe-video':
      self.elems.content.innerHTML = '';
      this.showClose();
      this.showLoading();
      this.updatePagination();
      this.iframeElem = document.createElement('iframe');
      this.iframeElem.className = 'rooverlay-video-frame';
      this.elems.content.appendChild(this.iframeElem);
      this.appendDescription();
      this.fit();
      this.iframeElem.src = slide.src;
      this.iframeElem.onload = function(){
        self.iframeElem.onload = undefined;
        self.hideLoading();
        self.afterSlideRender();
        self.fit();
      };
      this.iframeElem.onerror = function(){
        self.elems.content.innerHTML = '<div class="rooverlay-missing">' + self.options.i18n.missing + '</div>';
        self.hideLoading();
        self.afterSlideRender();
        self.fit();
      };
    break;
    case 'iframe':
      self.elems.content.innerHTML = '';
      this.showLoading();
      this.updatePagination();
      self.fit();
      this.iframeElem = document.createElement('iframe');
      this.iframeElem.onload = function(){
        self.iframeElem.onload = undefined;
        self.hideLoading();
        self.afterSlideRender();
        self.fit();
      };
      this.iframeElem.onerror = function(){
        self.elems.content.innerHTML = '<div class="rooverlay-missing">' + self.options.i18n.missing + '</div>';
        this.changeToContentClose();
        self.hideLoading();
        self.afterSlideRender();
        self.fit();
      };
      this.iframeElem.src = slide.src;
      self.elems.content.appendChild(self.iframeElem);
      this.changeToContentClose();
    break;
    case 'html':
      var elem = document.createElement('div');
      elem.className = 'rooverlay-content-html';
      if (slide.html){
        elem.innerHTML = slide.html;
      }
      else if (slide.content){
        elem.appendChild(slide.content);
      }
      else {
        elem.innerHTML = '';
      }
      this.elems.content.appendChild(elem);
      this.changeToContentClose();
      this.hideLoading();
      this.afterSlideRender();
      self.fit();
    break;
  }
};

Rooverlay.prototype.changeToContentClose = function changeToContentClose(){
  var self = this;
  var contentCloseElem = document.createElement('a');
  contentCloseElem.href = '#';
  contentCloseElem.className = 'rooverlay-content-close';
  addEvent(contentCloseElem, 'click', function(e){
    e.preventDefault();
    self.destroy();
  });
  if (this.elems.content.firstChild){
    this.elems.content.insertBefore(contentCloseElem, this.elems.content.firstChild);
  }
  else {
    this.elems.content.appendChild(contentCloseElem);
  }
  this.hideClose();
};

Rooverlay.prototype.appendDescription = function appendDescription(){
  if (this.slide.description){
    var descriptionElem = document.createElement('div');
    descriptionElem.className = 'rooverlay-description';
    descriptionElem.innerHTML = this.slide.description;
    this.elems.content.appendChild(descriptionElem);
  }
};

Rooverlay.prototype.afterSlideRender = function afterSlideRender(){
  if (this.slide.title){
    this.elems.title.innerHTML = this.slide.title;
  }
  else {
    this.elems.title.innerHTML = '';
  }
  this.updatePagination();
  this.options.onAfterSlideRender();
};

Rooverlay.prototype.updatePagination = function afterSlideRender(){
  if (this.options.pagination){
    this.elems.pagination.innerHTML = (this.currentSlideIndex + 1) + '/' + (this.lastSlideIndex + 1);
  }
};

Rooverlay.prototype.close = Rooverlay.prototype.destroy = function destroy(){
  this.options.onBeforeClose();
  this.options.container.removeChild(this.elems.wrapper);
  removeEvent(window, 'resize', this.resizeCallback);
  removeEvent(window, 'keydown', this.keydownCallback);
};

Rooverlay.prototype.getMarginWidth = function getMarginWidth(){
  if (this.options.marginWidth){
    return this.options.marginWidth;
  }
  return this.elems.left.offsetWidth + this.elems.right.offsetWidth;
};

Rooverlay.prototype.getMarginHeight = function getMarginHeight(){
  if (this.options.marginHeight){
    return this.options.marginHeight;
  }
  return this.elems.top.offsetHeight + this.elems.bottom.offsetHeight;
};

module.exports = Rooverlay;
