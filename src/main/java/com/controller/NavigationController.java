package com.controller;

import com.entity.Scenes;
import com.service.ScenesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class NavigationController {
    @Autowired
    private ScenesService scenesService;

    @GetMapping("/")
    public String getStart(Model model) {
        model.addAttribute("scenes", scenesService.findAll());
        return "museum";
    }

    @GetMapping("/cms")
    public String getSceneEditor(@RequestParam("id") Long id, Model model) {
        Scenes scene = scenesService.getByID(id);
        model.addAttribute("name", scene.getName());
        model.addAttribute("settings", scene.getSettings());
        model.addAttribute("title", scene.getTitle());
        model.addAttribute("id", id);
        return "scene-editor";
    }

    @GetMapping("/stand")
    public String getStand() {
        return "stand";
    }

}
