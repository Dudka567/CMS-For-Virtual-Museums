package com.controller;

import com.data.Scene;
import com.entity.Scenes;
import com.service.ScenesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ScenesController {
    @Autowired
    private ScenesService scenesService;

    @RequestMapping(value = "/addScene", method = RequestMethod.POST, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public String addScene(@ModelAttribute Scene scene, Model model) {
        System.out.println(scene.getTitle());
        System.out.println(scene.getName());
        System.out.println(scene.getSettings());
        Scenes newScene = scenesService.addScene(scene.getSettings(), scene.getName(), scene.getTitle());

        model.addAttribute("name", newScene.getName());
        model.addAttribute("settings", newScene.getSettings());
        model.addAttribute("title", newScene.getTitle());
        model.addAttribute("id", newScene.getId());
        return "scene-editor";
    }

    @RequestMapping(value = "/updateScene", method = RequestMethod.POST, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public String updateScene(@ModelAttribute Scene scene, Model model) {
        Scenes newScene = scenesService.saveScene(scene.getId(), scene.getSettings(), scene.getName(), scene.getTitle());

        model.addAttribute("name", newScene.getName());
        model.addAttribute("settings", newScene.getSettings());
        model.addAttribute("title", newScene.getTitle());
        model.addAttribute("id", newScene.getId());
        return "scene-editor";
    }

    @RequestMapping(value = "/deleteScene", method = RequestMethod.POST, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public String deleteScene(@ModelAttribute Scene scene, Model model) {
        scenesService.deleteScene(scene.getId(), scene.getSettings(), scene.getName(), scene.getTitle());
        model.addAttribute("scenes", scenesService.findAll());
        return "museum-for-admins";
    }
}
