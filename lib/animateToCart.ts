// src/lib/animateToCart.ts
export function animateToCart(options: {
  imageRect: DOMRect;
  cartRect: DOMRect;
  imageSrc: string;
}) {
  const { imageRect, cartRect, imageSrc } = options;

  const flyingImage = document.createElement('img');
  flyingImage.src = imageSrc;
  flyingImage.alt = 'flying-to-cart';

  flyingImage.style.position = 'fixed';
  flyingImage.style.left = imageRect.left + 'px';
  flyingImage.style.top = imageRect.top + 'px';
  flyingImage.style.width = imageRect.width + 'px';
  flyingImage.style.height = imageRect.height + 'px';
  flyingImage.style.pointerEvents = 'none';
  flyingImage.style.zIndex = '9999';
  flyingImage.style.borderRadius = '16px';
  flyingImage.style.objectFit = 'cover';

  document.body.appendChild(flyingImage);

  const translateX =
    cartRect.left + cartRect.width / 2 - (imageRect.left + imageRect.width / 2);
  const translateY =
    cartRect.top + cartRect.height / 2 - (imageRect.top + imageRect.height / 2);

  const animation = flyingImage.animate(
    [
      // 0% – старт: картка як є
      {
        transform: 'translate(0, 0) scale(1)',
        opacity: 1,
      },
      // 30% – картинка ніби виїжджає з картки (трішки вгору й збільшується)
      {
        transform: 'translate(0, -40px) scale(1.08)',
        opacity: 1,
        offset: 0.7,
      },
      // 100% – політ до кошика та зменшення
      {
        transform: `translate(${translateX}px, ${translateY}px) scale(0.2)`,
        opacity: 0,
        offset: 1,
      },
    ],
    {
      duration: 1500, // повільніше й плавніше
      easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      fill: 'forwards',
    }
  );

  animation.onfinish = () => {
    flyingImage.remove();
  };
}
