// Create a module (Think of as "container")
var newbie = angular.module("newbie", ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

// Routing configurarion for handling our views/routes.
newbie.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/slides', {
      templateUrl: 'templates/slides.html',
      controller: 'SlidesCtrl'
    }).
    when('/slides/list', {
      templateUrl: 'templates/slides-list.html',
      controller: 'SlidesCtrl'
    }).
    when('/slides/edit', {
      templateUrl: 'templates/slides-edit.html',
      controller: 'SlidesEditCtrl'
    }).
    otherwise({
      redirectTo: '/slides'
    });
  }]
);


// Controller for main slides view
newbie.controller("SlidesCtrl", ['$scope', 'Slides', function($scope, Slides) {
  if (typeof localStorage['slides'] !== 'undefined') {
    $scope.slides = JSON.parse(localStorage['slides']);
  } else {
    Slides.get().success(function(response) {
      localStorage['slides'] = JSON.stringify(response);
      $scope.slides = response;
    });
  }
  $scope.resetJSON = function () {
    localStorage.removeItem('slides');
  }  
}]);

// Controller for slides edit view
newbie.controller("SlidesEditCtrl", ['$scope', 'Slides', '$location', function($scope, Slides, $location) {
  
  
  if (typeof localStorage['slides'] !== 'undefined') {
    $scope.slides = JSON.parse(localStorage['slides']);
  } else {
    Slides.get().success(function(response) {
      localStorage['slides'] = JSON.stringify(response);
      $scope.slides = response;
    });
  }

  // Custom method attached to the scope. Making is callable within the scope of this controller.
  $scope.updateSlides = function() {
    localStorage['slides'] = angular.toJson($scope.slides);
    $scope.savedSlides = true;
    $location.path('/slides');
  };
  
  $scope.move = function (from, to) {
    if (to >= 0 && to < $scope.slides.length) {
      var fromSlide = $scope.slides[from];
      var toSlide = $scope.slides[to];
      $scope.slides[to] = fromSlide;
      $scope.slides[from] = toSlide;
      localStorage['slides'] = angular.toJson($scope.slides);
    }
  }

  // Another custom method. For adding slides.
  $scope.addSlide = function() {
    lastSlide = $scope.slides[$scope.slides.length-1];
    newSlide = {
      id: parseInt(lastSlide.id) + 1,
      header: "",
      image: "",
      text: ""
    };
    $scope.slides.push(newSlide);
    localStorage['slides'] = angular.toJson($scope.slides);
  };
  
  // Custom method when pressing "go back" button.
  $scope.cancelUpdate = function(slides) {
    $location.path('/slides');
  };
}]);



newbie.factory('Slides', ['$http', function($http){
  return {
    get: function () {
      return $http.get('/slides.json');
    },
    update: function (slides) {
      return $http.post('/slides.json', JSON.stringify(slides));
    }
  };
}]);