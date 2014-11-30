/*
//  This file should be responsible
// for tracking all inputs on a page.
//  and then triggering an event on
//  focus, unfocus that calls / hides the keyboard
*/


$(document).ready(function() {
  // $('body').attr('ng-app', 'Swarachakra'); // adds angular dependancy. Why? TODO!

  var totalinputs = 0; // initialise
  $("input[type='text'], textarea").each( function(index) {
    totoalinputs = totalinputs + 1;
  }).focus( function() {
    if (!$(this).hasClass('swarachakrainputenabled')) {
      $(this).addClass('swarachakrainputenabled'); // Adds the swarachakra Class on focus.
      if ($('.swarachakrasurrownder')[0]) {
        return;
      }
      $('body').append("<div class='swarachakrasurrownder'></div>");
      $('.swarachakrasurrownder').load(chrome.extension.getURL("templates/js/keyboard.html"), function () {
        angular.bootstrap('.swarachakrasurrownder', ['Swarachakra']);
      });
    }
  }).focusout(function() {
    if ($(this).hasClass('swarachakrainputenabled')) {
      $(this).removeClass('swarachakrainputenabled'); // Removes the swarachakra class when out of focus.
    }
    //$('body').find('.swarachakrasurrownder').remove(); // TODO: Clicking on the keyboard also removes the keyboard, fix.
  });
});

// The keyboard JavaScript

var app;

app = angular.module("Swarachakra", ["ngAnimate", "ngRoute"]);
app.directive("swarachakraTimeoutChange", [
  "$timeout", function($timeout) {
    return {
      restrict: "A",
      link: function(scope, element, attributes) {
        var interval;
        interval = 3000;
        $(element).bind("input propertychange", function() {
          var timeout;
          $timeout.cancel(timeout);
          timeout = $timeout(function() {
            scope.$apply(attributes.swarachakraTimeoutChange);
          }, interval);
        });
      }
    };
  }
]);

app.filter("unsafeFilter", function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
});

app.controller("AppController", [
  "$scope", "$http", "LanguageModel", function($scope, $http, LanguageModel) {
    var languageResource;
  }
]);

app.controller("KeyboardController", [
  "$scope", "$http", "LanguageModel", "KeyboardModel", "SaveModel","$sce", function($scope, $http, LanguageModel, KeyboardModel, SaveModel,$sce) {
    var languageResource;
    $scope.recordedtext = "";
    languageResource = $http.get(chrome.extension.getURL('languages/kannada/kannada.json'));
    chrome.extension.getURL('languages/kannada/kannada.json')
    angular.element("#swarachakra_chakra").css("display", "none");
    languageResource.success(function(languageobject) {
      LanguageModel.addAll(languageobject);
      $scope.currentlanguage = languageobject;
      $scope.currentlanguagename = $scope.currentlanguage.name;
      KeyboardModel.addlanguage($scope.currentlanguage);
      $scope.onscreen = KeyboardModel.getallkeys();
      $scope.firstmaintablekeys = KeyboardModel.maintablelayout1();
      $scope.secondmaintablekeys = KeyboardModel.maintablelayout2();
      $scope.thirdmaintablekeys = KeyboardModel.maintablelayout3();
      $scope.forthmaintablekeys = KeyboardModel.maintablelayout4();
      $scope.firsttablekeys = KeyboardModel.firsttablelayout();
      $scope.lasttablekeys = KeyboardModel.lasttablelayout();
      $scope.lastrowleftkeys = KeyboardModel.lasttableleftlayout();
      $scope.lastrowrightkeys = KeyboardModel.lasttablerightlayout();
      $scope.defaultchakrakeys = KeyboardModel.swarachakrakeys();
    });
    $scope.displaychakra = function(code, label, event, chakra, customchakra) {
      if (chakra == true && customchakra == false) {
        angular.element("#swarachakra_chakra").css("left", event.screenX - 100).css("top", event.screenY - 180).css("display", "block");
        angular.element("#swarachakra_innerchakra").css("position", "absolute");
      } else if (chakra == true || customchakra == true) {
        $scope.customchakrakeys = KeyboardModel.customchakrakeys(code)
        $scope.defaultchakrakeys = $scope.customchakrakeys;
        angular.element("#swarachakra_chakra").css("left", event.screenX - 100).css("top", event.screenY - 180).css("display", "block");
        angular.element("#swarachakra_innerchakra").css("position", "absolute");
      }
      $scope.currentkey = label;
    };
    $scope.hidechakra = function() {
      angular.element("#swarachakra_chakra").css("display", "none");
    };
    $scope.shifttable = function() {
      $scope.frame1 = !$scope.frame1;
    };
    $scope.sharetext = function(typer) {
      $scope.recordedtext += typer;
    };
    $scope.delete = function () {
      $scope.recordedtext.substr(0, $scope.recordedtext.length-1);
    };
  }
]);

app.factory("KeyboardModel", function() {
  var KeyboardModel;
  KeyboardModel = function() {
    this.keys = [];
    this.key = [];
    this.keyid = {};
    this.languageobject = {};
    this.chakrakeys = [];
  };
  KeyboardModel.prototype = {
    addlanguage: function(languageobject) {
      this.languageobject = languageobject;
    },
    getallkeys: function() {
      var currentlanguage, div, grouped, i, mod, totalrows;
      currentlanguage = this.languageobject;
      this.chakrakeys = currentlanguage.defaultchakra;
      totalrows = currentlanguage.csv.length;
      grouped = [];
      i = 0;
      while (i < totalrows) {
        div = Math.floor(i / 5);
        mod = i % 5;
        if (mod === 0) {
          grouped[div] = [];
        }
        grouped[div][mod] = currentlanguage.csv[i];
        i++;
      }
      this.keys = grouped;
      return grouped;
    },
    firsttablelayout: function(language) {
      var i, table;
      i = 0;
      table = [];
      while (i < 4) {
        table[i] = this.keys[8][i];
        i++;
      }
      return table;
    },
    maintablelayout1: function() {
      var i, table;
      i = 0;
      table = [];
      while (i < 4) {
        table[i] = this.keys[i];
        i++;
      }
      return table;
    },
    maintablelayout2: function() {
      var i, table;
      i = 4;
      table = [];
      while (i < 8) {
        table[i - 4] = this.keys[i];
        i++;
      }
      return table;
    },
    maintablelayout3: function() {
      var i, table;
      i = 8;
      table = [];
      while (i < 12) {
        table[i] = this.keys[i];
        i++;
      }
      return table;
    },
    maintablelayout4: function() {
      var i, table;
      i = 12;
      table = [];
      while (i < 16) {
        table[i] = this.keys[i];
        i++;
      }
      return table;
    },
    lasttableleftlayout: function(id) {
      var table;
      table = {};
      table = this.keys[8][4];
      return table;
    },
    lasttablerightlayout: function(id) {
      var i, table;
      table = [];
      i = 0;
      while (i < 3) {
        table[i] = this.keys[10][i];
        i++;
      }
      return table;
    },
    lasttablelayout: function(id) {
      var i, table;
      table = [];
      i = 2;
      while (i < 5) {
        table[i - 2] = this.keys[9][i];
        i++;
      }
      return table;
    },
    swarachakrakeys: function() {
      var chakrakeys = this.chakrakeys.split(" ");
      return chakrakeys;
    },
    customchakrakeys: function(code) {
      var i, chakrakeys;
      i=1;
      while(i < this.languageobject.csv.length) {
        if (i == code) {
          chakrakeys = this.languageobject.csv[i-1].customchakralayout;
          break;
        } else {
          i++;
        }
      }
      return chakrakeys;
    }
  };
  return new KeyboardModel();
});

app.factory("LanguageModel", function() {
  var LanguageModel;
  LanguageModel = function() {
    this.languages = [];
    this.languageid = {};
    this.deleted = null;
    this.updated = null;
  };
  LanguageModel.prototype = {
    add: function(language) {
      this.languages.push(language);
    },
    addAll: function(languages) {
      var i;
      i = 0;
      while (i < languages.length) {
        this.add(languages[i]);
        i++;
      }
    },
    getAll: function() {
      return this.languages;
    },
    get: function(id) {
      var i;
      i = 0;
      while (i < this.languages.length) {
        if (id === this.languages[i].id) {
          this.languageid = this.languages[i];
          break;
        }
        i++;
      }
      return this.languageid;
    },
    update: function(language) {
      var i;
      i = 0;
      while (i < this.languages.length) {
        if (this.languages[i].id === language.id) {
          this.languages[i] = language;
          break;
        }
        i++;
      }
      this.languageid[language.id] = language;
      this.updated = language;
    },
    remove: function(id) {
      var i;
      i = 0;
      while (i < this.languages.length) {
        if (this.languages[i].id === id) {
          this.languages.splice(i, 1);
          delete this.languageid[id];
          this.deleted = {
            id: id
          };
          break;
        }
        i++;
      }
    }
  };
  return new LanguageModel();
});

app.factory("SaveModel", [
  "$q", function($q) {
    var SaveModel;
    SaveModel = function() {
      this.queue = {};
      this.flushLock = false;
    };
    SaveModel.prototype = {
      add: function(textinput) {
        this.queue[0] = textinput;
        this.flush();
      },
      flush: function() {
        var i, keys, requests, self, textinput;
        keys = Object.keys(this.queue);
        if (keys.length === 0 || this.flushLock) {
          return;
        } else {
          this.flushLock = true;
        }
        self = this;
        requests = [];
        i = 0;
        while (i < keys.length) {
          textinput = this.queue[keys[i]];
          requests.push(textinput.put().then(this.inputUpdateRequest.bind(null, textinput)));
          i++;
        }
        this.queue = {};
        $q.all(requests).then(function() {
          self.flushLock = false;
          self.flush();
        });
      },
      inputUpdateRequest: function(input, response) {
        input = response;
      }
    };
    return new SaveModel();
  }
]);
