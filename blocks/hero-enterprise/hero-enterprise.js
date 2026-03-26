export default function decorate(block) {
  const hasPicture = block.querySelector(':scope > div:first-child picture');

  if (hasPicture) {
    // Image provided via authored content – use it as background
    return;
  }

  // No authored image – inject the hero background image
  const bgDiv = document.createElement('div');
  bgDiv.classList.add('hero-enterprise-bg');

  const picture = document.createElement('picture');
  const source = document.createElement('source');
  source.media = '(min-width: 600px)';
  source.srcset = '/hero-bg.jpeg';
  const img = document.createElement('img');
  img.src = '/hero-bg.jpeg';
  img.alt = '';
  img.loading = 'eager';
  img.width = 2880;
  img.height = 1480;
  picture.append(source, img);
  bgDiv.append(picture);

  block.prepend(bgDiv);
}
