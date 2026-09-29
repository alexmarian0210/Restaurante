package com.example.restaurante.controller;

import com.example.restaurante.model.Prato;
import com.example.restaurante.model.Ingrediente;
import com.example.restaurante.repository.IngredienteRepository;
import com.example.restaurante.repository.PratoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RestauranteController {

    private final PratoRepository pratoRepository;
    private final IngredienteRepository ingredienteRepository;

    public RestauranteController(PratoRepository pratoRepository, IngredienteRepository ingredienteRepository) {
        this.pratoRepository = pratoRepository;
        this.ingredienteRepository = ingredienteRepository;
    }

    @GetMapping("/cardapio")
    public List<Prato> getCardapio() {
        return pratoRepository.listarCardapioCompleto();
    }

    @GetMapping("/estoque")
    public List<Ingrediente> getEstoque() {
        return ingredienteRepository.listarEstoque();
    }

    @PostMapping("/pedidos")
    public ResponseEntity<String> registrarVenda(@RequestParam Integer pratoId, @RequestParam(defaultValue = "1") Integer quantidade) {
        ingredienteRepository.darBaixaNoEstoque(pratoId, quantidade);
        return ResponseEntity.ok("Venda registrada e estoque atualizado com sucesso!");
    }
}   