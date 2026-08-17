export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-awards-${cols.length}-cols`);
}
