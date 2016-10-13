// Code goes here
let app = angular.module('mailbox', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('mailboxes', {
        url: 'mailboxes',
        template: `<mailboxes></mailboxes>`,
    })
    $stateProvider.state('mailbox', {
        parent: 'mailboxes',
        url: '/:mailboxId',
        template: `<letters mailbox-id="mailboxId"></letters>`,
        controller: function ($stateParams, $scope) {
            $scope.mailboxId = $stateParams.mailboxId;
        }
    })
    $stateProvider.state('letter', {
        parent: 'mailbox',
        url: '/letters/:letterId',
        template: `<letter letter-id="letterId"></letter>`,
        controller: function ($stateParams, $scope) {
            $scope.letterId = $stateParams.letterId;
        }
    })
})


app.component("mailboxes", {
    controller: function (MailsDataSvc) {

        MailsDataSvc.getAllMailboxes()
                .then(mailboxes => {
                    this.mailboxes = mailboxes;
                })
    },
    template: `<div ng-repeat="mailbox in $ctrl.mailboxes">
               <a ui-sref="mailbox({mailboxId: mailbox._id })" ui-sref-active="active">{{mailbox.title}}</a><br/>
              </div>
              <ui-view></ui-view>`

})
        .component("letters", {
            bindings: {
                mailboxId: '<'
            },
            template: `<div ng-repeat="letter in $ctrl.letters">
               <a ui-sref="letter({letterId:letter._id })" ui-sref-active="active">{{letter.subject}}</a><br/>
              </div>
              <ui-view></ui-view>`,
            controller: function (MailsDataSvc) {
                MailsDataSvc.getAllMails().then(letters => {
                    this.letters = letters.filter(i => i.mailbox == this.mailboxId);
                })
            }
        })
        .component("letter", {
            bindings: {
                letterId: '<'
            },
            template: `<span>{{$ctrl.letter.body}}</span>`,
            controller: function (MailsDataSvc) {
                MailsDataSvc.getAllMails().then(letters => {
                    this.letter = letters.filter(i => i._id == this.letterId)[0];
                })
            }
        })

app.service('MailsDataSvc', function ($http) {
    this.getAllMails = () => {
        return $http.get('http://test-api.javascript.ru/v1/vmerkotan/letters?delay=1000')
                .then(response => response.data)
    }
    this.getAllMailboxes = () => {
        return $http.get('http://test-api.javascript.ru/v1/vmerkotan/mailboxes?delay=1000')
                .then(response => response.data)
    }
})