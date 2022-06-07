package com.controller;

import lombok.Data;


public class Scene {
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Scene(Long id) {
        this.id = id;
    }
    //    private String title;
//    private String name;
}
