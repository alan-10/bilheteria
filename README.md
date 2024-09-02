
## Instruções em etapas

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

4. Utilização de Websocket para atualizaão em tempo real, ou inscrição de eventos no formato pubsub

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
  irá abrir a documentação swagger que da acesso a api,
  nesta documentação tem um CRUD completo que implementa a lóciga de criação a deleção de (EVENTOS e TICKETS)

  5. Para ter acesso aos endpoints terá que efetuar o login e pegar o token e autenticar no swagger, video abaixo mostrando os passos

     Login de autenticação
     
      username: admin

      password: admin
     

https://github.com/user-attachments/assets/d6a5826f-7bc7-4648-af99-baef5363dee2

6. Pronto!, agora poderá utilizar todas as rotas

 ###  O que foi utilizado e realizado

 - Foi utilizado  Jestjs com  Mongodb, docker para conteinerizar a aplicação, 
 - Foi adicionado autenticação de login com retorno de jsonwebtoken, 
 - Foi adicionado validação dos campos com o class-validator do JestJs
 - Foi adicionado proteção das rotas com o auth.guard
 - Foi adicionado documentação swagger com o @nestjs/swagger 
 - Foi implementado testes unitários nos services o modulo de eventos e de ingressos 


</details>


<details>
 <summary>  Etapa 3 </summary>

 <details>
  <summary>No Código </summary>


```


import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Product } from './product.model';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

  async createProduct(createProductDto: CreateProductDto): Promise<string> {
    const { title, description, price, category } = createProductDto;

    if (!title || !price) {
      throw new BadRequestException('Title and Price are required');
    }

    const session: ClientSession = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      const newProduct = new this.productModel({
        title,
        description,
        price,
        category,
      });

      const result = await newProduct.save({ session });
      await session.commitTransaction();
      return result.id as string;
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException('Failed to create product');
    } finally {
      session.endSession();
    }
  }

  async getProducts(filters?: any): Promise<Product[]> {
    const { category, minPrice, maxPrice } = filters || {};
    const query = this.productModel.find();

    if (category) {
      query.where('category').equals(category);
    }

    if (minPrice !== undefined) {
      query.where('price').gte(minPrice);
    }

    if (maxPrice !== undefined) {
      query.where('price').lte(maxPrice);
    }

    const products = await query.select('title description price category').exec();

    if (products.length === 0) {
      throw new NotFoundException('No products found with the given criteria');
    }

    return products;
  }

  async getProduct(productId: string): Promise<Product> {
    const product = await this.findProduct(productId);
    return product;
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto): Promise<void> {
    const { title, description, price, category } = updateProductDto;

    const session: ClientSession = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      const updatedProduct = await this.findProduct(productId, session);
      if (title) updatedProduct.title = title;
      if (description) updatedProduct.description = description;
      if (price) updatedProduct.price = price;
      if (category) updatedProduct.category = category;

      await updatedProduct.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException('Failed to update product');
    } finally {
      session.endSession();
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const session: ClientSession = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      const result = await this.productModel.deleteOne({ _id: productId }, { session }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException('Could not find product.');
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException('Failed to delete product');
    } finally {
      session.endSession();
    }
  }

  private async findProduct(id: string, session?: ClientSession): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id).session(session).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}



```

 </details> 

1 - No método getProducts e findProduct pode adicionar a captura de exceções para tratar possíveis erros ao consultar produtos.
 
2 - No método getProducts esta verifivando o if com undefined, é uma melhor abordagem verificar se tem o filtro e se tiver aplicar, pois a comparação com negativos é uma melhor pratica na programação defensiva/early return, parar o fluxo caso uma condição não seja satisfeita.

3 - Observação: No método findProduct, a sessão é opcional. Se a leitura do produto for realizada fora do contexto de uma transação ativa (onde a sessão é passada), pode haver inconsistências se outros processos estiverem modificando os dados ao mesmo tempo.
 
 
</details>


<details>
 <summary>Video apresentação </summary>

 link do video 
 https://www.youtube.com/watch?v=fpGTRicUlY0
 
</details>
