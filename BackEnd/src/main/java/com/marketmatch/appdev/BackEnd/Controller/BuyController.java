package com.marketmatch.appdev.BackEnd.Controller;


import com.marketmatch.appdev.BackEnd.DTO.Transaction;
import com.marketmatch.appdev.BackEnd.Entity.BuyEntity;
import com.marketmatch.appdev.BackEnd.Entity.ProductEntity;
import com.marketmatch.appdev.BackEnd.Service.BuyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/buy")
public class BuyController {
    @Autowired
    BuyService buy_serv;

    @GetMapping("/getAll")
    public List<BuyEntity> getAllItems(){
        return buy_serv.getAllBoughtItems();
    }

    @GetMapping("/purchase")
    public List<Transaction> getAllPurchase(@RequestParam int id){
        return buy_serv.getPurchased(id);
    }

    @PostMapping("/create")
    public BuyEntity buyItem(@RequestBody BuyEntity payload){
        System.out.println("Received Payload: " + payload.getProduct());
        return buy_serv.buyItem(payload);
    }

    @PutMapping("/edit")
    public BuyEntity editItemBought(@RequestParam int id, @RequestBody BuyEntity item){
        return buy_serv.editBoughtItem(id, item);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteBoughtItem(@PathVariable int id){
        return buy_serv.deleteItem(id);
    }

}
