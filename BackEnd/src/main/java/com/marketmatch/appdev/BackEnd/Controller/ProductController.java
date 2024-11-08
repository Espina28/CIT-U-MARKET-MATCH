package com.marketmatch.appdev.BackEnd.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marketmatch.appdev.BackEnd.Entity.ProductEntity;
import com.marketmatch.appdev.BackEnd.Service.ProductService;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/user")
public class ProductController {

    @Autowired
    ProductService productService;

    // CREATE
    @PostMapping("/postProduct")
    public ProductEntity postProduct(@RequestBody ProductEntity product) {
        return productService.createProduct(product);
    }

    // READ
    @GetMapping("/getProducts/{productId}")
    public ProductEntity getProducts(@PathVariable int productId) {
        return productService.readProducts(productId);
    }

    // UPDATE
    @PutMapping("/putProduct/{productId}")
    public ProductEntity putProduct(@RequestParam int productId, @RequestBody ProductEntity productName) {
        return productService.updateProduct(productId, productName);
    }

    // DELETE
    @DeleteMapping("/deleteProduct/{productId}")
    public String deleteProduct(@PathVariable int productId) {
        return productService.deleteProduct(productId);
    }
}
