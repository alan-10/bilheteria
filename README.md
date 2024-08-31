
<details> 
<summary>Etapa 1</summary>

</br>
 Plano de Ação: Sistema de Bilheteria para Cassino
 
1. Alta Confiabilidade
Microsserviços com NestJS: A arquitetura em microsserviços permite isolar funcionalidades críticas, como venda de ingressos e gerenciamento de lotação. Isso garante que falhas em um serviço não afetem o sistema como um todo.

Replica Set em MongoDB: Utilização de réplicas de banco de dados para garantir que o sistema continue funcionando mesmo em caso de falhas. Réplicas asseguram que os dados estejam sempre disponíveis e que não haja interrupção nas operações.

Circuit Breaker e Retry: Implementação do padrão Circuit Breaker para isolar falhas e evitar sobrecarga nos serviços. Tentativas automáticas de reconexão garantem que o sistema recupere de falhas temporárias sem interrupções perceptíveis.

2. Escalabilidade
Auto-Scaling com Kubernetes: O uso de Kubernetes para orquestração de microsserviços permite escalabilidade horizontal automática. Durante picos de demanda, novas instâncias dos serviços são criadas para lidar com o aumento de tráfego, assegurando que o sistema mantenha o desempenho.

Mensageria com RabbitMQ/Kafka: Utilização de filas de mensagens para balancear a carga entre microsserviços e processar grandes volumes de transações de forma assíncrona, garantindo que o sistema possa lidar com picos sem perder desempenho.

3. Consistência de Dados
Transações ACID em MongoDB: Utilização de transações ACID para garantir que todas as operações de venda de ingressos sejam consistentes e livres de duplicações. Isso assegura que os ingressos vendidos sejam contabilizados corretamente.

Padrão Sagas: Implementação do padrão Sagas para transações distribuídas, garantindo que, em caso de falha, as operações sejam compensadas e o sistema mantenha a consistência dos dados.
</details>



<details>
  <summary> Etapa 2 </summary>

 ###  Como startar a aplicação 
 
  1. Fazer o download do projeto https://github.com/alan-10/bilheteria
 
  2. Abrir o arquivo bilheteria
    
  3. executar o comando `docker compose up --build`
  este comando irá levantar a api junto com o banco de dados.
  4. Acessar no seu navegador http://localhost:3000/api, 
  irá abrir a documentação swagger que da acesso a api
  nesta documentação tem um CRUD completo que implementa a lóciga de criação a deleção de (EVENTOS e TICKETS)

  5. Para ter acesso aos endpoints terá que efetuar o login e pegar o token e autenticar no swagger, video a baixo


https://github.com/user-attachments/assets/d6a5826f-7bc7-4648-af99-baef5363dee2

6. Pronto!, agora poderá utilizar todas as rotas

 ###  O que foi utilizado

 Foi utilizado  Jestjs com  Mongodb, docker para conteinerizar a aplicação, 
 foi adicionado autenticação de login com retorno de jsonwebtoken, 
 foi adicionado validação dos campos com o class-validator do JestJs
 foi adicionado proteção das rotas com o auth.guard
 foi adicionado documentação swagger com o @nestjs/swagger 

 



</details>
