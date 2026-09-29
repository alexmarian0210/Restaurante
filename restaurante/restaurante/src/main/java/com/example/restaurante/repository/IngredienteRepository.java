package com.example.restaurante.repository;

import com.example.restaurante.model.Ingrediente;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class IngredienteRepository {

    private final JdbcTemplate jdbcTemplate;

    public IngredienteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List listarEstoque() {
        String sql = """
            SELECT id, nome, estoque_atual, estoque_minimo, unidade_medida,
                   (estoque_atual <= estoque_minimo) AS em_alerta
            FROM ingredientes;
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new Ingrediente(
            rs.getInt("id"),
            rs.getString("nome"),
            rs.getBigDecimal("estoque_atual"),
            rs.getBigDecimal("estoque_minimo"),
            rs.getString("unidade_medida"),
            rs.getBoolean("em_alerta")
        ));
    }

    @Transactional
    public void darBaixaNoEstoque(Integer pratoId, Integer quantidade) {
        String sql = """
            UPDATE ingredientes i
            JOIN prato_itens pi ON i.id = pi.ingrediente_id
            SET i.estoque_atual = i.estoque_atual - (pi.quantidade_necessaria * ?)
            WHERE pi.prato_id = ?;
        """;
        jdbcTemplate.update(sql, quantidade, pratoId);
    }
}