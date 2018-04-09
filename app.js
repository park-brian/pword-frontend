(function () {

    const app = angular.module('phonewordapp', []);

    app.controller('PhoneWordController', ['$http', function ($http) {

        const baseUrl = 'http://localhost:8080/api/generatewords';
        this.defaultButtonMessage = 'Keep typing until you see a 7 or 10 digit number :)';
        this.phoneWords = [];
        this.input = '';
        this.parsedNumber = '';
        this.canSubmit = false;
        this.buttonMessage = this.defaultButtonMessage;
        this.loading = false;
        this.pagingInfo = {};

        this.inputChanged = function () {
            this.parsedNumber = this.input.replace(/\D/g, '');
            this.evaluateInput();
        };

        this.generatePhoneWords = function (page) {
            if (!this.canSubmit) {
                // In case the user is pressing enter in the input field before the phone number is valid.
                return;
            }

            const that = this;
            this.loading = true;

            let url = `${baseUrl}/${this.parsedNumber}`;
            if (page) {
                url += `?page=${page}`;
            }
            $http.get(url).then(function (result) {
                that.phoneWords = result.data.phoneWords;
                that.pagingInfo.totalResults = result.data.totalWordCount;
                that.pagingInfo.totalPages = result.data.totalPages;
                that.pagingInfo.pageNumber = result.data.pageNumber + 1;
                that.pagingInfo.pageSize = result.data.pageSize;
                that.pagingInfo.isFirstPage = result.data.isFirstPage;
                that.pagingInfo.isLastPage = result.data.isLastPage;

                that.loading = false;

            });
        };

        this.evaluateInput = function () {
            const readyToSubmit = /^(\d{7})(\d{3})?$/.test(this.parsedNumber);
            this.buttonMessage = readyToSubmit ? 'Generate Words!' : this.defaultButtonMessage;
            this.canSubmit = readyToSubmit;
        };

    }]);

    app.directive('inputSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'input.html'
        };
    });

    app.directive('resultsSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'results.html'
        };
    });


})();