package com.example.restaurante.model;

import java.math.BigDecimal;

public class Prato {
    private Integer id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private String categoria;
    private String alergenicos;

    // Construtor sem argumentos (exigido por algumas bibliotecas)
    public Prato() {
    }

    // Construtor completo usado pelo Repository
    public Prato(Integer id, String nome, String descricao, BigDecimal preco, String categoria, String alergenicos) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
        this.alergenicos = alergenicos;
    }

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getAlergenicos() { return alergenicos; }
    public void setAlergenicos(String alergenicos) { this.alergenicos = alergenicos; }
}