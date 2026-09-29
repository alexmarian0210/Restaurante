package com.example.restaurante.repository;

import com.example.restaurante.model.Prato;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PratoRepository {

    private final JdbcTemplate jdbcTemplate;

    public PratoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List listarCardapioCompleto() {
        String sql = """
            SELECT 
                p.id, 
                p.nome, 
                p.descricao, 
                p.preco, 
                c.nome AS categoria,
                GROUP_CONCAT(DISTINCT a.nome SEPARATOR ', ') AS alergenicos
            FROM pratos p
            JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN prato_itens pi ON p.id = pi.prato_id
            LEFT JOIN ingrediente_alergenicos ia ON pi.ingrediente_id = ia.ingrediente_id
            LEFT JOIN alergenicos a ON ia.alergenico_id = a.id
            GROUP BY p.id;
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new Prato(
            rs.getInt("id"),
            rs.getString("nome"),
            rs.getString("descricao"),
            rs.getBigDecimal("preco"),
            rs.getString("categoria"),
            rs.getString("alergenicos")
        ));
    }
}