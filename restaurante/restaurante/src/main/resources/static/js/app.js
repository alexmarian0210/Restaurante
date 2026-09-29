document.addEventListener("DOMContentLoaded", function () {
    carregarDados();
    configurarAbas();
    configurarNavegacao();
    configurarPWA();
});

let pratos = [];
let deferredInstallPrompt = null;

function carregarDados() {
    definirStatus("loading");
    return Promise.allSettled([
        carregarCardapio(),
        carregarEstoque()
    ]).then(function (resultados) {
        const ok = resultados.some(function (r) {
            return r.status === "fulfilled";
        });
        definirStatus(ok ? "ok" : "error");
    });
}

function definirStatus(status) {
    const el = document.getElementById("status-api");
    if (!el) return;

    el.className = "status";

    if (status === "ok") {
        el.classList.add("status-ok");
        el.textContent = "Online";
    } else if (status === "error") {
        el.classList.add("status-error");
        el.textContent = "Offline";
    } else {
        el.classList.add("status-loading");
        el.textContent = "Conectando...";
    }
}

function carregarCardapio() {
    return fetch("/api/cardapio", { cache: "no-store" })
        .then(function (response) {
            if (!response.ok) throw new Error("Erro ao buscar cardápio");
            return response.json();
        })
        .then(function (dados) {
            pratos = Array.isArray(dados) ? dados : [];
            mostrarCategoria(document.querySelector(".aba-cardapio.aba-ativa")?.dataset.categoria || "Entrada");
        })
        .catch(function (erro) {
            console.error("Erro no cardápio:", erro);
            const grid = document.getElementById("grid-pratos");
            if (grid) {
                grid.innerHTML = '<div class="loading-card">Não foi possível carregar o cardápio.</div>';
            }
            throw erro;
        });
}

function configurarAbas() {
    document.querySelectorAll(".aba-cardapio").forEach(function (aba) {
        aba.addEventListener("click", function () {
            document.querySelectorAll(".aba-cardapio").forEach(function (outraAba) {
                outraAba.classList.remove("aba-ativa");
                outraAba.setAttribute("aria-selected", "false");
            });

            aba.classList.add("aba-ativa");
            aba.setAttribute("aria-selected", "true");
            mostrarCategoria(aba.dataset.categoria);
        });
    });
}

function mostrarCategoria(categoria) {
    const grid = document.getElementById("grid-pratos");
    if (!grid) return;

    const filtrados = pratos.filter(function (prato) {
        return prato.categoria &&
            prato.categoria.toString().trim().toLowerCase() === categoria.toString().trim().toLowerCase();
    });

    if (filtrados.length === 0) {
        grid.innerHTML = `
            <div class="loading-card">
                Nenhum prato cadastrado em <strong>${escapeHtml(categoria)}</strong>.
            </div>`;
        return;
    }

    grid.innerHTML = "";

    filtrados.forEach(function (prato) {
        const card = document.createElement("article");
        card.className = "prato-card";

        const preco = Number.parseFloat(prato.preco);
        const precoFormatado = Number.isNaN(preco) ? "0,00" : preco.toFixed(2).replace(".", ",");

        const alergicos = prato.alergenicos
            ? `<span class="tag-alergenico">⚠️ ${escapeHtml(prato.alergenicos)}</span>`
            : `<span class="tag-alergenico" style="background:#f5f5f5;color:#777;">Sem alergênicos mapeados</span>`;

        card.innerHTML = `
            <div class="categoria-prato">${escapeHtml(prato.categoria || "")}</div>
            <h3>${escapeHtml(prato.nome || "Sem nome")}</h3>
            ${prato.descricao ? `<p class="descricao">${escapeHtml(prato.descricao)}</p>` : ""}
            <p class="preco">R$ ${precoFormatado}</p>
            ${alergicos}
            <button type="button" class="btn-vender">Lançar venda · 1x</button>
        `;

        card.querySelector(".btn-vender").addEventListener("click", function () {
            venderPrato(prato.id);
        });

        grid.appendChild(card);
    });
}

function carregarEstoque() {
    return fetch("/api/estoque", { cache: "no-store" })
        .then(function (response) {
            if (!response.ok) throw new Error("Erro ao buscar estoque");
            return response.json();
        })
        .then(function (ingredientes) {
            const tabela = document.getElementById("tabela-estoque");
            if (!tabela) return;

            tabela.innerHTML = "";

            if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
                tabela.innerHTML = "<tr><td colspan='3'>Nenhum ingrediente cadastrado.</td></tr>";
                return;
            }

            ingredientes.forEach(function (item) {
                const tr = document.createElement("tr");
                if (item.emAlerta) tr.classList.add("alerta");

                tr.innerHTML = `
                    <td>${escapeHtml(item.nome || "")}</td>
                    <td>${item.estoqueAtual ?? 0} ${escapeHtml(item.unidadeMedida || "")}</td>
                    <td>${item.estoqueMinimo ?? 0} ${escapeHtml(item.unidadeMedida || "")}</td>
                `;
                tabela.appendChild(tr);
            });
        })
        .catch(function (erro) {
            console.error("Erro no estoque:", erro);
            const tabela = document.getElementById("tabela-estoque");
            if (tabela) {
                tabela.innerHTML = "<tr><td colspan='3'>Não foi possível carregar o estoque.</td></tr>";
            }
            throw erro;
        });
}

function venderPrato(pratoId) {
    if (!pratoId) {
        mostrarToast("ID do prato não encontrado.");
        return;
    }

    fetch("/api/pedidos?pratoId=" + encodeURIComponent(pratoId) + "&quantidade=1", {
        method: "POST"
    })
        .then(function (response) {
            if (!response.ok) throw new Error("Erro ao registrar venda");
            return response;
        })
        .then(function () {
            mostrarToast("✓ Venda registrada com sucesso!");
            return carregarEstoque();
        })
        .catch(function (erro) {
            console.error("Erro na venda:", erro);
            mostrarToast("Não foi possível registrar a venda.");
        });
}

function configurarNavegacao() {
    document.querySelectorAll(".nav-item").forEach(function (item) {
        item.addEventListener("click", function () {
            document.querySelectorAll(".nav-item").forEach(function (nav) {
                nav.classList.remove("nav-ativa");
            });
            item.classList.add("nav-ativa");
        });
    });

    const atualizar = document.getElementById("btn-atualizar");
    if (atualizar) {
        atualizar.addEventListener("click", function () {
            atualizar.disabled = true;
            carregarDados().finally(function () {
                atualizar.disabled = false;
            });
        });
    }
}

function configurarPWA() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js")
            .catch(function (erro) {
                console.warn("Service Worker não registrado:", erro);
            });
    }

    window.addEventListener("beforeinstallprompt", function (evento) {
        evento.preventDefault();
        deferredInstallPrompt = evento;

        const botao = document.getElementById("btn-instalar");
        if (botao) {
            botao.hidden = false;
            botao.addEventListener("click", instalarApp, { once: true });
        }
    });

    window.addEventListener("appinstalled", function () {
        deferredInstallPrompt = null;
        const botao = document.getElementById("btn-instalar");
        if (botao) botao.hidden = true;
        mostrarToast("App instalado na tela inicial.");
    });
}

function instalarApp() {
    if (!deferredInstallPrompt) return;

    deferredInstallPrompt.prompt();

    deferredInstallPrompt.userChoice.finally(function () {
        deferredInstallPrompt = null;
        const botao = document.getElementById("btn-instalar");
        if (botao) botao.hidden = true;
    });
}

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = mensagem;
    toast.classList.add("show");

    clearTimeout(mostrarToast.timer);
    mostrarToast.timer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2800);
}

function escapeHtml(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
