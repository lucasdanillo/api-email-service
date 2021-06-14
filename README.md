# 1 - Instruções de execução (desenvolvido com NodeJS)
- No terminal, acesse o diretório "server" e execute o comando "node index.js";
- Caso tudo ocorra bem, haverá um indicativo no terminal de que o servidor está escutando na porta 5000;
- Abra o arquivo index.html, presente no diretório "client", através de um navegador para ter acesso à aplicação que realiza as requisições.
- Para logar/criar usuário na aplicação, digite um nome de usuário válido (que não possua espaços em branco) no campo "Username". Caso o usuário ainda não exista, será criado um novo usuário. Caso exista, seus e-mails serão recuperados.
	
# 2 - Instruções de utilização da API

 ## URL: /api/emails	 Method: GET
 Retorna todos os e-mails persistidos no arquivo data.txt presente no diretório "server". Requisição não é utilizada no client e foi utilizada apenas para facilitar o desenvolvimento da aplicação.
 
 ## URL: /api/emails/:to	 Method: GET
 Retorna todos os e-mails persistidos no arquivo data.txt presente no diretório "server" que tenham como destinatário o usuário referente ao parâmetro "to". Requisição realizada ao logar com êxito na aplicação.
 
 ## URL: /api/emails	 Method: POST
 Persiste um e-mail no arquivo data.txt presente no diretório "server". Os dados do e-mail vêm pelo body da requisição. Requisição realizada ao clicar no botão "Send" do modal aberto ao clicar no botão "Write".

 ## URL: /api/emails/:id	 Method: DELETE
 Exclui um e-mail do arquivo data.txt presente no diretório "server". Requisição realizada ao clicar no botão "Delete" presente na seção "Actions" do e-mail a ser excluído.
 
 ## URL: /api/emails/:id	 Method: GET
 Retorna o conteúdo de um e-mail persistido no arquivo data.txt presente no diretório "server". Requisição realizada ao clicar no botão "Open" presente na seção "Actions" do e-mail.
 
 ## URL: /api/emails/fwd	 Method: POST
 Persiste um e-mail no arquivo data.txt presente no diretório "server". O dado do e-mail que vem pelo body da requisição é apenas o destinatário, pois se trata de um encaminhamento. Além disso, é passado o id do e-mail a ser encaminhado. Requisição realizada ao clicar no botão "Forward" presente no modal aberto pelo botão de mesmo nome na seção "Actions" do e-mail.

 ## URL: /api/emails/reply	 Method: POST
 Persiste um e-mail no arquivo data.txt presente no diretório "server". O dado do e-mail que vem pelo body da requisição é apenas o corpo do e-mail, pois se trata de uma resposta. Além disso, é passado o id do e-mail a ser respondido. Requisição realizada ao clicar no botão "Reply" presente no modal aberto pelo botão de mesmo nome na seção "Actions" do e-mail.
 
 ## URL: /api/users	 Method: POST
 Persiste ou retorna um usuário no/do arquivo users.txt presente no diretório "server". O dado que vem pelo body é o nome de usuário. Requisição realizada ao clicar no botão "Access".
