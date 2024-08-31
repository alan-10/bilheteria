
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