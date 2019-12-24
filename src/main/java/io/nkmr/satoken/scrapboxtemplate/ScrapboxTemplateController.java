package io.nkmr.satoken.scrapboxtemplate;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ScrapboxTemplateController {
    @GetMapping("/")
    public String index() {
        return "index";
    }
}
