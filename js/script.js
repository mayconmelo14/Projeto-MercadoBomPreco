// Skeleton no Carousel do DESTAQUE DE PRODUTOS
document.addEventListener("DOMContentLoaded", function () {
    // Define o tempo do loading falso (2.5 segundos)
    setTimeout(function () {

        // 1. Seleciona e esconde todos os skeletons falsos
        const skeletons = document.querySelectorAll('.card-skeleton');
        skeletons.forEach(skel => skel.classList.add('d-none'));

        // 2. Seleciona e mostra todos os cards reais de produtos
        const realCards = document.querySelectorAll('.card-real');
        realCards.forEach(card => card.classList.remove('d-none'));

    }, 1500);
});

//   Touch deslizar os slides do carousel
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
