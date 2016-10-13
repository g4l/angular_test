let app = angular.module('mailbox', []);


 app.service('messagesService', ['$http', function ($http) {
        this.getMessages = () => {
            return $http.get('http://test-api.javascript.ru/v1/alexmolchanov/mailboxes')
                      .then(response=>{
                          console.log(response.data);
                            return response.data;
                      },error=>{
                            alert(error.data.error);
                            return [];
                      });
        };
        
        this.addEmail = (email) => {
            return $http.post('http://test-api.javascript.ru/v1/alexmolchanov/mailboxes/', email)
                      .then(response => response.data, error => {
                          alert(error.data.error);
                          return false;
                      } );
        };
        
        this.removeEmail = (email) => {
            return $http.delete('http://test-api.javascript.ru/v1/alexmolchanov/mailboxes/' + email._id)
                        .then(response => response.data, error => {
                            alert(error.data.error)
                            return false;
                        } );
        };
        
        
}]);

app.component('gmail', {
    templateUrl: 'view/gmail_container.html',
    controller: ['messagesService',function (messagesService) {
        this.messagesLists = [];
         messagesService.getMessages().then(messages => {
            this.messagesLists = messages;
        },error => {
            this.messagesLists = [];
        });
    }]
});


app.component('messages', {
        templateUrl: 'view/messages.html',
        bindings: {
            messagesLists: '=messagesLists'
        },
        controller: ['messagesService', function (messagesService) {
     
            
            this.removeEmail = (email) => {
       
                messagesService.removeEmail(email).then((r) => {
                    if ( r === false ){
                        console.log('error');
                    } else {
                        this.messagesLists.splice(this.messagesLists.indexOf(email), 1);  
                    }
                }) 
            };
            
        
        }]
});

 app.component('compose', {
        template: `
            <button ng-click="$ctrl.addEmail()" class="compose btn btn-danger">
                Compose
            </button>
        `,
        bindings: {
            messagesLists: '=messagesLists'
        },
        controller: ['messagesService', function (messagesService) {
            this.addEmail = () => {
                var emailO = {
                    userName: 'userName',
                    title: 'title',
                    message: 'message',
                    time: 'time',
                }
                messagesService.addEmail(emailO).then((email) => {
                    //push email to global email storage
                    this.messagesLists.push(email);
                });
            };
            
        
    
          
        }]
      
});
