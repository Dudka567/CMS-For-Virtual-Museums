package com.controller;

import com.service.ScenesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class NavigationController {
    @Autowired
    private ScenesService scenesService;

    @GetMapping("/")
    public String getStart(Model model){
        model.addAttribute("scenes",scenesService.findAll());
        return "museum";
    }

    @RequestMapping(value = "/cms" , method = RequestMethod.POST, consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public String getCMS(Scene scene) {
        System.out.println(scene.getId());
        return "scene-editor";

    }
//    @PostMapping("/cms")
//    public String getCMS(@RequestParam(name = "id")Long id, Model model){
//        System.out.println(id);
//        return "scene-editor";
//    }

    @GetMapping("/stand")
    public String getStand(){
        return "stand";
    }














//    @GetMapping("/admin")
//    public String userList(Model model) {
//        model.addAttribute("allUsers", scenesService.allUsers());
//        return "admin";
//    }

//    @PostMapping("/admin")
//    public String  deleteUser(@RequestParam(required = true, defaultValue = "" ) Long userId,
//                              @RequestParam(required = true, defaultValue = "" ) String action,
//                              Model model) {
//        if (action.equals("delete")){
//            scenesService.deleteUser(userId);
//        }
//        return "redirect:/admin";
//    }
//
//    @GetMapping("/admin/gt/{userId}")
//    public String  gtUser(@PathVariable("userId") Long userId, Model model) {
//        model.addAttribute("allUsers", scenesService.usergtList(userId));
//        return "admin";
//    }
}
