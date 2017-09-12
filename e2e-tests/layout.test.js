'use strict';

describe('layout', function() {
	function clearLocalStorage() {
		browser.executeScript('localStorage.clear()');
	}

	beforeAll(function() {
		//var width = 1280;
		//var height = 1024;
		//browser.ignoreSynchronization = false;
		//browser.driver.manage().window().setSize(width, height);
		browser.get('');
	});

	describe('ui view', function() {
		it('should be displayed', function(done) {
			expect(element(by.css('[ui-view]')).isDisplayed()).toBeTruthy();
			done();
		});
	});

	describe('footer', function() {
		it('should be displayed', function() {
			expect(element(by.css('footer')).isDisplayed()).toBeTruthy();
		});
	});

	describe('sidenav', function() {
		it('should be displayed', function() {
			expect(element(by.css('md-sidenav')).isDisplayed()).toBeTruthy();
		});

		describe('language selector', function() {
			var btn, menu;

			function getMenu() {
				btn = element(
					by.cssContainingText('md-menu button', 'language')
				);
				return btn.getAttribute('aria-owns')
					.then(function(id) { menu = element(by.id(id)); });
			}

			function reload() {
				browser.get('');
				return getMenu();
			}

			function select(value) {
				return btn.click()
					.then(function() {
						return menu
							.element(by.cssContainingText('button', value))
							.click();
					});
			}

			beforeAll(getMenu);
			afterEach(clearLocalStorage);

			it('should be displayed', function() {
				expect(btn.isDisplayed()).toBeTruthy();
			});

			it('should select default language', function(done) {
				var txt;
				reload()
					.then(function() { return btn.click(); })
					.then(function() {
						return menu.$('.md-accent').getText();
					})
					.then(function(text) {
						txt = text;
						return btn.click();
					})
					.then(function() {
						expect(txt).toEqual('en');
						done();
					});
			});

			it('should select language', function(done) {
				var lang;
				select('ru')
					.then(btn.click)
					.then(function() {
						return menu.$('.md-accent').getText();
					})
					.then(function(text) {
						lang = text;
						return btn.click();
					})
					.then(function() {
						expect(lang).toEqual('ru');
						done();
					});
			});

			it('should translate page contents', function(done) {
				var oldText;
				var el = element(by.css('md-sidenav h1'));
				select('en')
					.then(function() { return el.getText(); })
					.then(function(text) {
						expect(text.length).toBeGreaterThan(0);
						oldText = text;
						return select('ru');
					})
					.then(function() { return el.getText(); })
					.then(function(text) {
						expect(text.length).toBeGreaterThan(0);
						expect(text).not.toEqual(oldText);
						done();
					});
			});

			it('should save selected language', function(done) {
				var lang;
				reload()
					.then(function() { return select('ru'); })
					.then(reload)
					.then(function() { return btn.click(); })
					.then(function() {
						return menu.element(by.css('.md-accent')).getText();
					})
					.then(function(text) {
						lang = text;
						return btn.click();
					})
					.then(function() {
						expect(lang).toEqual('ru');
						done();
					});
			});
		});
	});
});
