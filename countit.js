// countit.js
angular.module('countItApp', [])
.controller('CountItCtrl', function($scope) {
	$scope.username = $scope.password = $scope.itemTitle = '';
	$scope.items = [];

	Parse.initialize('APPLICATIONID',
                   'JAVASCRIPTKEY');

	var Item = Parse.Object.extend('Item', {
		increaseCount: function() {
		  this.save({timesCompleted: this.get('timesCompleted') + 1});
		},

		getTitle: function() {
			return this.get('title');
		},

		getTimesCompleted: function() {
			return this.get('timesCompleted');
		}
	})

	$scope.isLoggedIn = function() {
		return Parse.User.current() ? true : false;
	}

	$scope.logout = function() {
		Parse.User.logOut();
	}

	$scope.getUsername = function() {
		return Parse.User.current() ? Parse.User.current().getUsername() : '';
	}

	$scope.logIn = function() {
		Parse.User.logIn($scope.username, $scope.password, {
		  success: function(user) {
		    $scope.findItems();
		  },
		  error: function(user, error) {
		    alert('Error: ' + error.code + ' ' + error.message);
		  }
		});
	}

	$scope.signUp = function() {
		var user = new Parse.User();

		user.signUp({username: $scope.username,password: $scope.password}, {
		  success: function(user) {
		    $scope.logIn();
		  },
		  error: function(user, error) {
		    alert('Error: ' + error.code + ' ' + error.message);
		  }
		});
	}	

	$scope.addItem = function() {
		var item = new Item();

		item.save({
			title: $scope.itemTitle, 
			timesCompleted: 0,
			user: Parse.User.current(),
			ACL: new Parse.ACL(Parse.User.current())
		}, {
			success: function(item) {
				$scope.$apply(function() {
					$scope.items.push(item);
				});
			},
			error: function(t, error) {
				alert('Error: '+error.message);
			}
		});

		$scope.itemTitle = '';
	}

	$scope.removeItem = function(item) {
		for(var i=0; i<$scope.items.length; i++) {
			if($scope.items[i] == item) {
				$scope.items.splice(i, 1);
				item.destroy();
				break;
			}
		}
	}

	$scope.findItems = function() {
		var query = new Parse.Query(Item);
		query.find().then(function(list) {
			$scope.$apply(function() {
				$scope.items = list;
			});
		});
	}

	$scope.findItems();
});