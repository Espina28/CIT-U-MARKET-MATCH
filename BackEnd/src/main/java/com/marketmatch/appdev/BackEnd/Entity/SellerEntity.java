package com.marketmatch.appdev.BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "tbl_seller")
public class SellerEntity {

    @Id
    private int seller_id;

    private int products_sold;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private UserEntity userid;

    @JsonManagedReference
    @OneToMany(mappedBy = "sellerid", fetch = FetchType.LAZY)
    private List<ProductEntity> products;


    public List<ProductEntity> getProducts() {
        return products;
    }

    public void setProducts(List<ProductEntity> products) {
        this.products = products;
    }

    public int getSeller_id() {
        return seller_id;
    }

    public void setSeller_id(int seller_id) {
        this.seller_id = seller_id;
    }

    public UserEntity getUserid() {
        return userid;
    }

    public void setUserid(UserEntity userid) {
        this.userid = userid;
    }

    public int getProducts_sold() {
        return products_sold;
    }

    public void setProducts_sold(int products_sold) {
        this.products_sold = products_sold;
    }
}