﻿function MessagesCtrl($scope, $rootScope, $sce, Context, Content, Confirm) {
	$scope.messages = {
		show: false,
		list: null,
		toggle: function () {
			if (this.show) {
				this.close();
			} else {
				this.open($scope.Context.Messages)
			}
		},
		open: function (messages) {
			this.show = true;
			this.list = messages
		},
		close: function (messages) {
			this.show = false;
			this.list = null;
		},
		removePermanently: function (message) {
			console.log("remove", message);

			Confirm({
				title: "Remove permanently for all users?",//Translate("confirm.unpublish.title"),
				message: message,
				template: "<b class='ico fa fa-envelope'></b> {{settings.message.Title}}",
				confirmed: function () {
					Content.removeMessage({ ID: message.ID, Source: message.Source.Name }, $scope.messages.loadAll);
				}
			});
		},
		clear: function () {
			var max = null;
			angular.forEach(this.list, function (message) {
				if (!max || max < message.Updated)
					max = message.Updated;
			});
			$scope.Context.User.Settings.LastDismissed = max;
			$scope.Context.Messages = [];
			$scope.saveUserSettings();
			this.close();
		},
		loadAll: function () {
			delete $scope.Context.User.Settings.LastDismissed;
			Context.messages(Content.applySelection({}, $scope.Context.CurrentItem), function (result) {
				$scope.messages.list = result.Messages;
				$scope.Context.Messages = result.Messages;
			});
			$scope.saveUserSettings();
		}
	};

	$scope.$watch("Context.Messages", function (messages) {
		if (messages && messages.length) {
			angular.forEach(messages, function (message) {
				if (message.Alert) {
					message.Expanded = true;
					$scope.messages.open(messages);
				}
			});
		} else if ($scope.messages.show)
			$scope.messages.list = messages;
	})
}
