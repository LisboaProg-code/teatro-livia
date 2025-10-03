function abrirCortina(){
    document.getElementById("cortinas").classList.add("aberta");
    let botao = document.getElementById('btn')
    botao.style.display = 'none'

    let roteiro = document.getElementById("roteiro")
    roteiro.style.transition = 'opacity 10s ease'
    roteiro.style.opacity = "1"

}

const paginas = document.querySelectorAll('.conteiner_roteiro .pagina');
let atual = 0;

function virarPagina(direcao) {
  if(direcao === 'proximo' && atual < paginas.length - 1) {
    paginas[atual].classList.add('virar');
    atual++;
  } else if(direcao === 'voltar' && atual > 0) {
    atual--;
    paginas[atual].classList.remove('virar');
  }
}

// Desktop: clique nas bordas
document.querySelector('.conteiner_roteiro').addEventListener('click', e => {
  const rect = e.currentTarget.getBoundingClientRect();
  if(e.clientX > rect.width / 2) virarPagina('proximo');
  else virarPagina('voltar');
});

// Mobile: swipe
let startX = 0;
document.querySelector('.conteiner_roteiro').addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});
document.querySelector('.conteiner_roteiro').addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  if(startX - endX > 50) virarPagina('proximo');
  else if(endX - startX > 50) virarPagina('voltar');
});

// Teclado
document.addEventListener('keydown', e => {
  if(e.key === 'ArrowRight') virarPagina('proximo');
  if(e.key === 'ArrowLeft') virarPagina('voltar');
});

/* button */

let btnSim = document.getElementById('sim')
let btnNao = document.getElementById('nao')

let fogos = [];
let particulas = [];
let animandoFogos = false;

// Plateia + música + fogos
function Sim(){
  document.getElementById("img").classList.toggle("subir");

  let audio = document.getElementById("musica");
  audio.play();
  
  let convite = document.getElementById("convite")
  let imgconvite = document.getElementById('emoji2')
  convite.style.transition = "opacity .5s ease"
  convite.style.opacity = "0"
  convite.style.display = 'none'
  imgconvite.style.display = "block"
  imgconvite.style.transition = "opacity .5s ease"
  imgconvite.style.opacity = "1"



  if (!animandoFogos) {
    animandoFogos = true;
    iniciarFogos();
  }
}

// ===================
//  FOGOS DE ARTIFÍCIO
// ===================
const canvas = document.getElementById("fogos");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Fogo {
  constructor(x, y, cor) {
    this.x = x;
    this.y = y;
    this.cor = cor;
    this.velocidade = { x: 0, y: -5 };
    this.explodido = false;
    this.alturaAlvo = Math.random() * (canvas.height * 0.5); 
  }

  update() {
    if (!this.explodido) {
      this.y += this.velocidade.y;
    
      if (this.y <= this.alturaAlvo) {
        this.explodir();}

      this.desenhar();
    }
  }

  desenhar() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.cor;
    ctx.fill();
  }

  explodir() {
    this.explodido = true;
    for (let i = 0; i < 50; i++) {
      particulas.push(new Particula(this.x, this.y, this.cor));
    }
  }
}

class Particula {
  constructor(x, y, cor) {
    this.x = x;
    this.y = y;
    this.cor = cor;
    this.velocidade = {
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 6
    };
    this.alpha = 1;
  }

  update() {
    this.x += this.velocidade.x;
    this.y += this.velocidade.y;
    this.velocidade.y += 0.05; // gravidade
    this.alpha -= 0.02;
    this.desenhar();
  }

  desenhar() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.cor;
    ctx.fill();
    ctx.restore();
  }
}

function animar() {
  requestAnimationFrame(animar);
  ctx.clearRect(0,0, canvas.width, canvas.height)

  fogos.forEach((f, i) => {
    f.update();
    if (f.explodido) fogos.splice(i, 1);
  });

  particulas.forEach((p, i) => {
    p.update();
    if (p.alpha <= 0) particulas.splice(i, 1);
  });
}

function novoFogo() {
  const x = Math.random() * canvas.width;
  const y = canvas.height;
  const cor = `hsl(${Math.random() * 360}, 100%, 50%)`;
  fogos.push(new Fogo(x, y, cor));
}

function iniciarFogos() {
  setInterval(novoFogo, 500);
  animar();
}

const pagina4 = document.querySelector(".pagina4");

// Função que move o botão aleatoriamente **dentro da página 4**
function fugirBotao() {
  const larguraContainer = pagina4.clientWidth;
  const alturaContainer = pagina4.clientHeight;
  const larguraBotao = btnNao.offsetWidth;
  const alturaBotao = btnNao.offsetHeight;

  // Garante que o botão não saia do container
  const novaEsquerda = Math.random() * (larguraContainer - larguraBotao);
  const novaTop = Math.random() * (alturaContainer - alturaBotao);

  btnNao.style.position = "absolute";
  btnNao.style.left = `${novaEsquerda}px`;
  btnNao.style.top = `${novaTop}px`;
}

// Desktop: mouse entrando no botão
btnNao.addEventListener("mouseenter", fugirBotao);

// Mobile: toque no botão
btnNao.addEventListener("touchstart", fugirBotao);