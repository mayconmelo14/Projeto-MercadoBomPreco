// Skeleton no Carousel do DESTAQUE DE PRODUTOS
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {

        // Seleciona e esconde todos os skeletons falsos
        const skeletons = document.querySelectorAll('.card-skeleton');
        skeletons.forEach(skel => skel.classList.add('d-none'));

        // Seleciona e mostra todos os cards reais de produtos
        const realCards = document.querySelectorAll('.card-real');
        realCards.forEach(card => card.classList.remove('d-none'));

    }, 2000);
});

//Touch deslizar os slides do carousel
document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper('.bannerSwiper', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        spaceBetween: 20,
        grabCursor: true,
        /* Ativa a paginação por bolinhas/quadrados */
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
});

// Dropdown menu Aparece/Desaparece
const menuToggle = document.getElementById('menu-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Evento: clique no ícone do menu
menuToggle.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
});

// Fecha menu ao clicar em algum dos links
const menuLinks = document.querySelectorAll('.dropdown-menu a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
    });
});

// Carrinho

// Seleciona os elementos do Carrinho
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const cartClose = document.getElementById('cart-close');

// Abre o carrinho
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    // Fecha o menu se ele estiver aberto
    dropdownMenu.classList.remove('active');
});

// Fecha o carrinho no botão X
cartClose.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// Quantidade Carrinho

// Função que calcula e atualiza o valor total do carrinho
function atualizarTotalCarrinho() {
    let totalGeral = 0;
    const itens = document.querySelectorAll('.cart-item');

    itens.forEach(item => {
        const precoBase = parseFloat(item.getAttribute('data-price'));
        const quantidade = parseInt(item.querySelector('.qty-value').textContent);

        // Calcula o subtotal do item específico
        const subtotalItem = precoBase * quantidade;
        totalGeral += subtotalItem;

        // Atualiza o texto do preço do próprio item
        item.querySelector('.item-price').textContent = `R$ ${subtotalItem.toFixed(2).replace('.', ',')}`;
    });

    // Atualiza o valor do Total Geral do carrinho
    const totalElemento = document.querySelector('.cart-total span:last-child');
    if (totalElemento) {
        totalElemento.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    }
}

// --- VARIÁVEIS GLOBAIS E SELEÇÃO DE ELEMENTOS ---
const cartItemsContainerElement = document.querySelector('.cart-items');
const toast = document.getElementById('toast-notification');
const deleteModal = document.getElementById('delete-modal');
const btnCancelDelete = document.getElementById('btn-cancel-delete');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');

let itemParaRemover = null; // Guarda o elemento temporariamente para exclusão

// --- 1. LÓGICA DE QUANTIDADE (+ e -) E ACIONAMENTO DO MODAL DE EXCLUSÃO ---
cartItemsContainerElement.addEventListener('click', (e) => {
    // Encontra o item do carrinho onde o clique aconteceu
    const cartItem = e.target.closest('.cart-item');
    if (!cartItem) return;

    const qtyValueElement = cartItem.querySelector('.qty-value');
    let quantidadeAtual = parseInt(qtyValueElement.textContent);

    // Se clicou no botão de Mais (+)
    if (e.target.classList.contains('plus')) {
        quantidadeAtual++;
        qtyValueElement.textContent = quantidadeAtual;
        atualizarTotalCarrinho();
    }

    // Se clicou no botão de Menos (-)
    if (e.target.classList.contains('minus')) {
        if (quantidadeAtual > 1) {
            quantidadeAtual--;
            qtyValueElement.textContent = quantidadeAtual;
            atualizarTotalCarrinho();
        }
    }

    // Se clicou no botão de lixeira para remover o produto
    if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
        itemParaRemover = cartItem; // Salva o item que o usuário quer apagar
        deleteModal.classList.add('active'); // Abre o modal
    }
});

// --- 2. AÇÕES DO MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ---

// Se o usuário clicar em Cancelar, apenas fecha o modal
btnCancelDelete.addEventListener('click', () => {
    deleteModal.classList.remove('active');
    itemParaRemover = null;
});

// Se o usuário confirmar, deleta o item e SÓ fecha a gaveta se o carrinho zerar
btnConfirmDelete.addEventListener('click', () => {
    if (itemParaRemover) {
        itemParaRemover.remove();
        
        // Recalcula os valores da tela imediatamente
        atualizarTotalCarrinho(); 
        
        // Checa se ainda restou algum produto no carrinho
        const itensRestantes = cartItemsContainerElement.querySelectorAll('.cart-item');
        
        // Se zerou tudo, fecha a gaveta do carrinho automaticamente
        if (itensRestantes.length === 0) {
            document.getElementById('cart-sidebar').classList.remove('active');
        }
    }
    
    // Fecha o modal de confirmação em qualquer situação
    deleteModal.classList.remove('active');
    itemParaRemover = null;
});

// Fecha o modal se clicar fora da caixinha branca dele
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
        itemParaRemover = null;
    }
});

// --- 3. ADIÇÃO IMERSIVA DOS PRODUTOS NA VITRINE (COM DELAY, TOAST E LOADER INTELIGENTE) ---
document.addEventListener('click', (e) => {
    // Intercepta o clique no botão com a classe que adicionamos
    if (e.target.classList.contains('btn-add-to-cart') || e.target.closest('.btn-add-to-cart')) {
        
        // Evita que o link '#' jogue a página para o topo
        e.preventDefault(); 
        
        // Busca o botão correto, mesmo se o clique foi no ícone do carrinho
        const botao = e.target.classList.contains('btn-add-to-cart') ? e.target : e.target.closest('.btn-add-to-cart');
        
        // Acha o card do produto mais próximo (.product-card)
        const productCard = botao.closest('.product-card');
        
        // Captura os dados dos atributos data- configurados
        const id = productCard.getAttribute('data-id');
        const name = productCard.getAttribute('data-name');
        const price = productCard.getAttribute('data-price');
        const img = productCard.getAttribute('data-img');

        // Salva o conteúdo original do botão e ativa classe de loading
        const textoOriginal = botao.innerHTML;
        botao.classList.add('loading');

        // Se o botão for redondo (Mais Procurados), põe só o loader. Se for o normal, põe o texto completo.
        if (botao.classList.contains('rounded-circle')) {
            botao.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i>`;
        } else {
            botao.innerHTML = `Adicionando... <i class='bx bx-loader-alt bx-spin'></i>`;
        }

        // Delay simulado de 800ms antes de inserir o produto
        setTimeout(() => {
            // Checa se o produto já está no carrinho
            const itensNoCarrinho = cartItemsContainerElement.querySelectorAll('.cart-item');
            let produtoJaExiste = false;

            itensNoCarrinho.forEach(item => {
                const nomeNoCarrinho = item.querySelector('.item-name').textContent;
                if (nomeNoCarrinho === name) {
                    // Se já existe, apenas aumenta o contador do seletor de quantidade
                    const qtyValueElement = item.querySelector('.qty-value');
                    let qtd = parseInt(qtyValueElement.textContent);
                    qtd++;
                    qtyValueElement.textContent = qtd;
                    produtoJaExiste = true;
                }
            });

            // Se o produto NÃO existe no carrinho, injeta o HTML dele
            if (!produtoJaExiste) {
                const novoItemHTML = `
                    <div class="cart-item" data-price="${price}">
                        <img src="${img}" alt="${name}">
                        <div class="item-details">
                            <p class="item-name">${name}</p>
                            <p class="item-price">R$ ${parseFloat(price).toFixed(2).replace('.', ',')}</p>
                            <div class="quantity-selector">
                                <button class="qty-btn minus">-</button>
                                <span class="qty-value">1</span>
                                <button class="qty-btn plus">+</button>
                            </div>
                        </div>
                        <i class='bx bx-trash remove-item'></i>
                    </div>
                `;
                
                // Coloca o item no final da lista do carrinho
                cartItemsContainerElement.insertAdjacentHTML('beforeend', novoItemHTML);
            }

            // Atualiza os valores do rodapé
            atualizarTotalCarrinho();

            // Restaura o botão original da vitrine
            botao.classList.remove('loading');
            botao.innerHTML = textoOriginal;

            // Mostra a mensagem Toast de sucesso temporariamente
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);

        }, 800); // Fim do delay de carregamento
    }
});

// --- 4. EVENTO PARA FECHAR A GAVETA DO CARRINHO AO CLICAR FORA (CORRIGIDO) ---
document.addEventListener('click', (e) => {
    const cartSidebarElement = document.getElementById('cart-sidebar');
    const cartToggleElement = document.getElementById('cart-toggle');
    const deleteModalElement = document.getElementById('delete-modal');

    // Se o carrinho não estiver aberto, não faz nada
    if (!cartSidebarElement || !cartSidebarElement.classList.contains('active')) return;

    // Se o clique foi dentro do carrinho ou no botão que abre o carrinho, não faz nada
    if (cartSidebarElement.contains(e.target) || cartToggleElement.contains(e.target)) return;

    // NOVA TRAVA: Se o clique foi dentro do modal de deletar (ou no próprio fundo dele), não faz nada!
    if (deleteModalElement && deleteModalElement.contains(e.target)) return;

    // Se passou por todas as travas acima, significa que o usuário realmente clicou no fundo do site
    cartSidebarElement.classList.remove('active');
});