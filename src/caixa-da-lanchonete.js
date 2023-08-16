class CaixaDaLanchonete {

    #cardapio = [
        { codigo: 'cafe', descricao: 'Café', valor: 3.00 },
        { codigo: 'chantily', descricao: 'Chantily (extra do Café)', valor: 1.50, extraDe: 'cafe' },
        { codigo: 'suco', descricao: 'Suco Natural', valor: 6.20 },
        { codigo: 'sanduiche', descricao: 'Sanduíche', valor: 6.50 },
        { codigo: 'queijo', descricao: 'Queijo (extra do Sanduíche)', valor: 2.00, extraDe: 'sanduiche' },
        { codigo: 'salgado', descricao: 'Salgado', valor: 7.25 },
        { codigo: 'combo1', descricao: '1 Suco e 1 Sanduíche', valor: 9.50 },
        { codigo: 'combo2', descricao: '1 Café e 1 Sanduíche', valor: 7.50 }
    ];

    #taxasConformeFormasDePagamento = [
        { tipo: 'dinheiro', taxa: 0.05 },
        { tipo: 'debito', taxa: 0 },
        { tipo: 'credito', taxa: 0.03 }
    ];

    #verificaSeExistemItensNoCarrinho(itens) {
        if (itens.length < 1) {
            return false;
        }

        return true;
    }

    #separaStringDoPedido(item) {
        let codigo = item.split(',').shift();
        let quantidade = item.split(',').pop();

        return [codigo, quantidade];
    }

    #verificaSeQuantidadeMenorQue1(quantidade) {
        if (quantidade < 1) {
            return true;
        }

        return false;
    }

    #verificaSeProdutoExiste(produto) {
        if (!produto) {
            return false;
        }

        return true;
    }

    #verificaSeEhExtra(produto) {
        if (produto.extraDe) {
            return true;
        }

        return false;
    }

    #verificaSeExisteProdutoPrincipalParaOExtra(produtoPedido, comanda) {
        let produtoPrincipal = comanda.find(produto => produto.codigo === produtoPedido.extraDe);
        if (!produtoPrincipal) {
            return false;
        }

        return true;
    }

    #verificaSeFormaDePagamentoEhValida(metodoDePagamento, metodosDisponiveisComTaxas) {
        let formaDePagamentoEhValida = metodosDisponiveisComTaxas
        .find(item => item.tipo === metodoDePagamento);

        if (!formaDePagamentoEhValida) {
            return false;
        }

        return true;
    }

    #adicionarProdutosNaComanda(produtoPedido, quantidade, comanda) {
        let i = 0;

        while (i < quantidade) {
            comanda.push(produtoPedido);
            i++;
        }
    }

    #adicionaTaxasDeAcordoComOMetodoDePagamento(metodoDePagamento, valorTotal, taxasConformeFormasDePagamento) {
        let totalComTaxa;
        switch (metodoDePagamento) {
            case 'debito':
                totalComTaxa = valorTotal;
                break;
            case 'credito':
                totalComTaxa = valorTotal * (1 + 
                    taxasConformeFormasDePagamento
                    .find(item => item.tipo === 'credito').taxa
                );
                break;
            case 'dinheiro':
                totalComTaxa = valorTotal * (1 - 
                    taxasConformeFormasDePagamento
                    .find(item => item.tipo === 'dinheiro').taxa
                );
                break;
        }

        return totalComTaxa;
    }

    calcularValorDaCompra(metodoDePagamento, itens) {
        //verifica se há itens no carrinho
        if (!this.#verificaSeExistemItensNoCarrinho(itens)) {
            return 'Não há itens no carrinho de compra!';
        }

        let comanda = [];
        let erro;
        itens.forEach(item => {

            //separa a string e pega os valores
            let [codigo, quantidade] = this.#separaStringDoPedido(item);

            //busca se o produto existe no cardapio
            let produtoPedido = this.#cardapio.find(produto => produto.codigo === codigo);

            //realização de algumas verificações do pedido
            if (this.#verificaSeQuantidadeMenorQue1(quantidade)) {
                erro = 'Quantidade inválida!';
                return;
            } else if (!this.#verificaSeProdutoExiste(produtoPedido)) {
                erro = 'Item inválido!';
                return;
            } else if (this.#verificaSeEhExtra(produtoPedido)) {
                if (!this.#verificaSeExisteProdutoPrincipalParaOExtra(produtoPedido, comanda)) {
                    erro = 'Item extra não pode ser pedido sem o principal';
                    return;
                }
            }
            
            this.#adicionarProdutosNaComanda(produtoPedido, quantidade, comanda);
        });

        if (erro) {
            return erro;
        }

        //verifica se forma de pagamento é válida
        if (!this.#verificaSeFormaDePagamentoEhValida(
            metodoDePagamento, 
            this.#taxasConformeFormasDePagamento
        )) return 'Forma de pagamento inválida!';

        //realiza soma
        let valorTotal = 0;
        comanda.forEach((item) => {
            valorTotal += item.valor;
        })

        //realizar adição de taxa conforme o tipo de pagamento
        valorTotal = this.#adicionaTaxasDeAcordoComOMetodoDePagamento(metodoDePagamento, valorTotal, this.#taxasConformeFormasDePagamento);
        
        //retorna o valor final com duas casas decimais separadas do inteiro por virgula
        return `R$ ${valorTotal.toFixed(2)}`.replace('.', ',');

    }

}

export { CaixaDaLanchonete };
