package com.example.restaurante.model;

import java.math.BigDecimal;

public class Ingrediente {
    private Integer id;
    private String nome;
    private BigDecimal estoqueAtual;
    private BigDecimal estoqueMinimo;
    private String unidadeMedida;
    private boolean emAlerta;

    public Ingrediente(Integer id, String nome, BigDecimal estoqueAtual, BigDecimal estoqueMinimo, String unidadeMedida, boolean emAlerta) {
        this.id = id;
        this.nome = nome;
        this.estoqueAtual = estoqueAtual;
        this.estoqueMinimo = estoqueMinimo;
        this.unidadeMedida = unidadeMedida;
        this.emAlerta = emAlerta;
    }

    public Integer getId() { return id; }
    public String getNome() { return nome; }
    public BigDecimal getEstoqueAtual() { return estoqueAtual; }
    public BigDecimal getEstoqueMinimo() { return estoqueMinimo; }
    public String getUnidadeMedida() { return unidadeMedida; }
    public boolean isEmAlerta() { return emAlerta; }
}