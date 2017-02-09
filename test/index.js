var expect = require('chai').expect;
var Rooverlay = require('../src/index.js');
var jsdomDocument = require('jsdom').jsdom();
global.document = jsdomDocument;
global.window = document.defaultView;


var elem;
function defaultRooverlay(options){
  return new Rooverlay(Object.assign({
    container: elem,
    slides: [{
      type: 'image',
      src: 'roo-pic-1.jpg'
    }, {
      type: 'image',
      title: 'Roo',
      description: 'foo roo',
      src: 'roo-pic-2.jpg'
    }, {
      type: 'image',
      src: 'roo-pic-3.jpg'
    }]
  }, options));
}
beforeEach(function(){
  elem = jsdomDocument.createElement('div');
});


describe('Rooverlay', function() {
  this.slow(200);

  describe('rendering', function(){
    it('should load, render image and append to container', function(done) {
      defaultRooverlay({
        slides: [{
          type: 'image',
          src: 'roo-pic-2.jpg'
        }]
      });

      setTimeout(function(){
        expect(elem.innerHTML).to.contain('roo-pic-2.jpg');
        done();
      }, 6);
    });

    it('should render empty overlay', function(done) {
      defaultRooverlay({
        slides: false
      });

      setTimeout(function(){
        expect(elem.querySelector('.rooverlay-content').innerHTML).to.equal('');
        done();
      }, 6);
    });

    it('should render "skin" option', function(done) {
      defaultRooverlay({
        skin: 'light'
      });

      setTimeout(function(){
        expect(elem.querySelector('.rooverlay-wrapper').classList.contains('rooverlay-skin-light')).to.equal(true);
        done();
      }, 6);
    });

    it('should update options', function(done) {
      var rooverlay = defaultRooverlay({
        slides: false
      });

      setTimeout(function(){
        rooverlay.updateOptions({
          pagination: true,
          slides: [{
            type: 'image',
            src: 'roo-pic-1.jpg'
          }, {
            type: 'image',
            title: 'Roo',
            src: 'roo-pic-2.jpg'
          }, {
            type: 'image',
            src: 'roo-pic-3.jpg'
          }]
        });
        setTimeout(function(){
          expect(elem.innerHTML).to.contain('roo-pic-1.jpg');
          done();
        }, 6);
      }, 6);
    });

    it('should add "extraClasses" option', function(done) {
      defaultRooverlay({
        skin: 'light',
        extraClasses: 'foo bar'
      });

      setTimeout(function(){
        expect(elem.querySelector('.rooverlay-wrapper').classList.contains('foo')).to.equal(true);
        expect(elem.querySelector('.rooverlay-wrapper').classList.contains('bar')).to.equal(true);
        done();
      }, 6);
    });

    describe('pagination', function(){
      it('should render pagination', function(done) {
        var rooverlay = defaultRooverlay({
          pagination: true
        });
        setTimeout(function(){
          expect(elem.querySelector('.rooverlay-pagination').innerHTML).to.equal('1/3');
          rooverlay.nextSlide();
          setTimeout(function(){
            expect(elem.querySelector('.rooverlay-pagination').innerHTML).to.equal('2/3');
            done();
          }, 6);
        }, 6);
      });
      it('should render pagination in descending order', function(done) {
        var rooverlay = defaultRooverlay({
          pagination: true,
          paginationDescending: true
        });
        setTimeout(function(){
          expect(elem.querySelector('.rooverlay-pagination').innerHTML).to.equal('3/3');
          rooverlay.nextSlide();
          setTimeout(function(){
            expect(elem.querySelector('.rooverlay-pagination').innerHTML).to.equal('2/3');
            done();
          }, 6);
        }, 6);
      });
    });

    describe('types', function(){
      describe('iframe', function(){
        it('should render html string', function() {
          new Rooverlay({
            container: elem,
            slides: [{
              type: 'iframe',
              src: 'roo.html'
            }]
          });
          expect(elem.innerHTML).to.contain('<iframe src="roo.html"></iframe>');
        });
      });

      describe('iframe-video', function(){
        it('should render iframe-video string', function() {
          new Rooverlay({
            container: elem,
            slides: [{
              type: 'iframe-video',
              src: 'roo.html'
            }]
          });
          expect(elem.innerHTML).to.contain('<iframe class="rooverlay-video-frame" src="roo.html"></iframe>');
        });
      });

      describe('html', function(){
        it('should render html string', function() {
          new Rooverlay({
            container: elem,
            slides: [{
              type: 'html',
              html: '<p>test</p>'
            }]
          });
          expect(elem.innerHTML).to.contain('<p>test</p>');
        });

        it('should render html element', function() {
          var div = jsdomDocument.createElement('div');
          div.innerHTML = '<p>test</p>';
          new Rooverlay({
            container: elem,
            slides: [{
              type: 'html',
              content: div
            }]
          });
          expect(elem.innerHTML).to.contain('<div><p>test</p></div>');
        });

        it('should hide main close with html', function() {
          var rooverlay = defaultRooverlay({
            slides: [{
              type: 'html',
              html: '<p>test</p>'
            }]
          });
          expect(rooverlay.elems.close.classList.contains('rooverlay-hide')).to.equal(true);
        });

        it('should reanable main close with image', function() {
          var rooverlay = defaultRooverlay({
            slides: [{
              type: 'html',
              html: '<p>test</p>'
            }, {
              type: 'image',
              src: 'roo-pic-2.jpg'
            }]
          });
          rooverlay.nextSlide();
          expect(rooverlay.elems.close.classList.contains('rooverlay-hide')).to.equal(false);
        });
      });
    });

    describe('title', function(){
      it('should show/hide title', function(done) {
        var rooverlay = defaultRooverlay();
        setTimeout(function(){
          expect(rooverlay.elems.title.innerHTML).to.contain('');
          rooverlay.nextSlide();
          setTimeout(function(){
            expect(rooverlay.elems.title.innerHTML).to.contain('Roo');
            rooverlay.nextSlide();
            setTimeout(function(){
              expect(rooverlay.elems.title.innerHTML).to.contain('');
              done();
            }, 6);
          }, 6);
        }, 6);
      });
    });

    describe('description', function(){
      it('should show/hide description', function(done) {
        var rooverlay = defaultRooverlay();
        rooverlay.jumpToSlide(1);
        setTimeout(function(){
          expect(rooverlay.elems.content.innerHTML).to.contain('foo roo');
          rooverlay.nextSlide();
          setTimeout(function(){
            expect(rooverlay.elems.title.innerHTML).to.not.contain('foo roo');
            done();
          }, 6);
        }, 6);
      });

      it('should show/hide descriptionElement', function(done) {
        var descriptionElem = jsdomDocument.createElement('div');
        descriptionElem.innerHTML = '<p>big test</p>';
        var rooverlay = defaultRooverlay({
          slides: [{
            type: 'image',
            title: 'Roo',
            descriptionContent: descriptionElem,
            src: 'roo-pic-2.jpg'
          }, {
            type: 'image',
            src: 'roo-pic-3.jpg'
          }]
        });
        setTimeout(function(){
          expect(rooverlay.elems.content.innerHTML).to.contain('<p>big test</p>');
          rooverlay.nextSlide();
          setTimeout(function(){
            expect(rooverlay.elems.title.innerHTML).to.not.contain('<p>big test</p>');
            done();
          }, 6);
        }, 6);
      });
    });

    describe('loading', function(){
      it('should show/hide loading', function() {
        var rooverlay = defaultRooverlay();
        rooverlay.showLoading();
        expect(rooverlay.elems.loader.classList.contains('rooverlay-hide')).to.equal(false);
        rooverlay.hideLoading();
        expect(rooverlay.elems.loader.classList.contains('rooverlay-hide')).to.equal(true);
      });
    });

    describe('_calculateSize', function(){
      it('should calculate with aspectRatio', function() {
        var size = Rooverlay.prototype._calculateSize({
          height: 1600,
          width: 1200,
          aspectRatio: true
        }, 500, 600);
        expect(size.width).to.equal(450);
        expect(size.height).to.equal(600);
      });
      it('should calculate without aspectRatio', function() {
        var size = Rooverlay.prototype._calculateSize({
          width: 1200,
          height: 1600,
          aspectRatio: false
        }, 500, 600);
        expect(size.width).to.equal(500);
        expect(size.height).to.equal(600);
      });
      it('should calculate without aspectRatio and with height', function() {
        var size = Rooverlay.prototype._calculateSize({
          height: 400,
          aspectRatio: false
        }, 500, 600);
        expect(size.width).to.equal(500);
        expect(size.height).to.equal(400);
      });
      it('should calculate without aspectRatio and without height', function() {
        var size = Rooverlay.prototype._calculateSize({
          aspectRatio: false
        }, 500, 600);
        expect(size.width).to.equal(500);
        expect(size.height).to.equal(600);
      });
      it('should calculate without aspectRatio and big window size', function() {
        var size = Rooverlay.prototype._calculateSize({
          width: 1200,
          height: 1600,
          aspectRatio: false
        }, 2000, 2600);
        expect(size.width).to.equal(1200);
        expect(size.height).to.equal(1600);
      });
      it('should calculate with aspectRatio and minSize', function() {
        var size = Rooverlay.prototype._calculateSize({
          height: 100,
          width: 40,
          minHeight: 200,
          minWidth: 200,
          aspectRatio: true
        }, 500, 600);
        expect(size.width).to.equal(200);
        expect(size.minWidth).to.equal(200);
        expect(size.height).to.equal(200);
        expect(size.minHeight).to.equal(200);
      });
      it('should calculate with aspectRatio and minSize but ignore minWidth because of window size', function() {
        var size = Rooverlay.prototype._calculateSize({
          height: 100,
          width: 40,
          minHeight: 200,
          minWidth: 200,
          aspectRatio: true
        }, 150, 400);
        expect(size.height).to.equal(200);
        expect(size.minHeight).to.equal(200);
        expect(size.width).to.equal(40);
        expect(size.minWidth).to.equal(undefined);
      });
    });


    describe('_getSizeSettings', function(){
      it('should setup for "image"', function() {
        var sizeSettings = Rooverlay.prototype._getSizeSettings({
          type: 'image',
          width: 150,
          height: 200
        }, {
          width: 200,
          height: 300
        });
        expect(sizeSettings.width).to.equal(150);
        expect(sizeSettings.height).to.equal(200);
        expect(sizeSettings.minHeight).to.equal(300);
        expect(sizeSettings.minHeight).to.equal(300);
      });
      it('should setup for "image" and override minSize', function() {
        var sizeSettings = Rooverlay.prototype._getSizeSettings({
          type: 'image',
          width: 150,
          height: 200,
          minHeight: 100,
          minWidth: 100
        }, {
          width: 200,
          height: 300
        });
        expect(sizeSettings.width).to.equal(150);
        expect(sizeSettings.height).to.equal(200);
        expect(sizeSettings.minHeight).to.equal(100);
        expect(sizeSettings.minHeight).to.equal(100);
      });
    });

  });

  describe('actions', function(){
    it('should go next', function(done) {
      var rooverlay = defaultRooverlay();
      setTimeout(function(){
        rooverlay.nextSlide();
        setTimeout(function(){
          expect(elem.innerHTML).to.not.contain('roo-pic-1.jpg');
          expect(elem.innerHTML).to.contain('roo-pic-2.jpg');
          done();
        }, 6);
      }, 6);
    });

    it('should go next via "click" event', function(done) {
      var rooverlay = defaultRooverlay();
      setTimeout(function(){
        var event = jsdomDocument.createEvent('HTMLEvents');
        event.initEvent('click', true, true);
        rooverlay.elems.right.dispatchEvent(event);
        setTimeout(function(){
          expect(elem.innerHTML).to.not.contain('roo-pic-1.jpg');
          expect(elem.innerHTML).to.contain('roo-pic-2.jpg');
          done();
        }, 6);
      }, 6);
    });

    it('should close', function(done) {
      var rooverlay = defaultRooverlay();
      setTimeout(function(){
        expect(elem.innerHTML).to.contain('roo-pic-1.jpg');
        rooverlay.destroy();
        expect(elem.innerHTML).to.equal('');
        done();
      }, 6);
    });

    it('should not close on overlay click', function(done) {
      var rooverlay = defaultRooverlay();
      setTimeout(function(){
        var event = jsdomDocument.createEvent('HTMLEvents');
        event.initEvent('click', true, true);
        rooverlay.elems.overlay.dispatchEvent(event);

        expect(elem.querySelectorAll('.rooverlay-content').length).to.equal(1);
        done();
      }, 6);
    });

    it('should close on overlay click', function(done) {
      var rooverlay = defaultRooverlay({closeOnOverlayClick: true});
      setTimeout(function(){
        var event = jsdomDocument.createEvent('HTMLEvents');
        event.initEvent('click', true, true);
        rooverlay.elems.overlay.dispatchEvent(event);

        expect(elem.innerHTML).to.equal('');
        done();
      }, 6);
    });

    it('should close with content-close for html', function(done) {
      var rooverlay = defaultRooverlay({
        slides: [{
          type: 'html',
          html: '<p>test</p>'
        }]
      });

      setTimeout(function(){
        var event = jsdomDocument.createEvent('HTMLEvents');
        event.initEvent('click', true, true);
        rooverlay.elems.wrapper.querySelector('.rooverlay-content-close').dispatchEvent(event);

        expect(elem.innerHTML).to.equal('');
        done();
      }, 6);
    });

    it('should jumpToSlide', function(done) {
      var rooverlay = defaultRooverlay();
      rooverlay.jumpToSlide(2);
      setTimeout(function(){
        expect(rooverlay.elems.wrapper.innerHTML).to.contain('roo-pic-3.jpg');
        done();
      }, 6);
    });

    describe('loop', function(){
      it('should not loop backwards', function() {
        var rooverlay = defaultRooverlay();
        rooverlay.previousSlide();
        expect(rooverlay.currentSlideIndex).to.equal(0);
      });

      it('should not loop forwards', function() {
        var rooverlay = defaultRooverlay();
        rooverlay.nextSlide();
        rooverlay.nextSlide();
        rooverlay.nextSlide();
        rooverlay.nextSlide();
        expect(rooverlay.currentSlideIndex).to.equal(2);
      });

      it('should loop backwards', function() {
        var rooverlay = defaultRooverlay({loop: true});
        rooverlay.previousSlide();
        expect(rooverlay.currentSlideIndex).to.equal(2);
      });

      it('should loop forwards', function() {
        var rooverlay = defaultRooverlay({loop: true});
        rooverlay.nextSlide();
        rooverlay.nextSlide();
        rooverlay.nextSlide();
        rooverlay.nextSlide();
        expect(rooverlay.currentSlideIndex).to.equal(1);
      });
    });
    describe('arrows', function(){
      it('should not show left arrow', function() {
        var rooverlay = defaultRooverlay();
        expect(rooverlay.elems.left.classList.contains('rooverlay-hide')).to.equal(true);
      });

      it('should show left arrow after nextSlide', function() {
        var rooverlay = defaultRooverlay();
        rooverlay.nextSlide();
        expect(rooverlay.elems.left.classList.contains('rooverlay-hide')).to.equal(false);
      });

      it('should show left arrow', function() {
        var rooverlay = defaultRooverlay({loop: true});
        expect(rooverlay.elems.left.classList.contains('rooverlay-hide')).to.equal(false);
      });

    });
  });

  describe('events', function(){
    it('onBeforeSlideRender', function() {
      var i = 0;
      var rooverlay = defaultRooverlay({
        onBeforeSlideRender: function(){
          i++;
        }
      });
      expect(i).to.equal(1);
      rooverlay.nextSlide();
      rooverlay.nextSlide();
      expect(i).to.equal(3);
    });

    it('onAfterSlideRender', function() {
      var i = 0;
      var rooverlay = defaultRooverlay({
        onAfterSlideRender: function(){
          i++;
        }
      });
      rooverlay.nextSlide();
      setTimeout(function() {
        rooverlay.nextSlide();
        setTimeout(function() {
          expect(i).to.equal(3);
        }, 6);
      }, 6);
    });

    it('onBeforeClose', function() {
      var i = 0;
      var rooverlay = defaultRooverlay({
        onBeforeClose: function(){
          i++;
        }
      });
      rooverlay.close();
      expect(i).to.equal(1);
    });
  });
});
